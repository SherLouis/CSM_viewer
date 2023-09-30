import { Result } from "../core/models/Result";
import { SourceSummary, Source } from "../core/models/Source";
import IDataRepository from "./IDataRepository";
import { SourceEntity, SourceEntityToModel, SourceToEntity } from "./entity/SourceEntity";
import { SourceSummaryEntity, SourceSummaryEntityToModel } from "./entity/SourceSummaryEntity";
import Database from "better-sqlite3";
import { ReadResultEntity, ReadResultEntityToModel } from "./entity/ResultEntity";
import { ROI } from "../core/models/ROI";
import { EffectArborescence } from "../core/models/EffectArborescence";
import { ROIEntity, ROIEntityToModel } from "./entity/ROIEntity";

export default class DataRepository implements IDataRepository {
    private dbLocation: string;
    private db: Database.Database;

    constructor(dbLocation: string) {
        this.dbLocation = dbLocation;
        this.db = new Database(this.dbLocation);
        this.createTablesIfNotExist();
    }

    setDbLocation(dbLocation: string): boolean {
        let currentDbLocation = this.dbLocation;
        try {
            this.close();
            this.db = new Database(dbLocation);
            this.createTablesIfNotExist();
            this.dbLocation = dbLocation;
            return true;
        }
        catch (e) {
            console.error(e)
            this.db = new Database(currentDbLocation);
            return false;
        }
    }
    close(): void {
        this.db.close();
    }

    // ROIs
    // TODO: implement
    getROIs(): ROI[] {
        const entities = this._getROIs();
        return entities.map((e) => ROIEntityToModel(e));
    }
    // TODO: implement
    addManualROI(name: string, parentName: string): void {
        throw new Error("Method not implemented.");
    }

    // Effects
    // TODO: implement
    getEffectArborescence(): EffectArborescence {
        throw new Error("Method not implemented.");
    }
    // TODO: implement
    addManualEffect(name: string, parentName: string): void {
        throw new Error("Method not implemented.");
    }

    // Sources
    getSource(sourceId: number): Source {
        const entity = this._getSource(sourceId);
        return SourceEntityToModel(entity);
    }
    getSources(): SourceSummary[] {
        const sources = this._getAllSourcesSummary();
        return sources.map((a) => SourceSummaryEntityToModel(a))
    }
    createSource(newSource: Source): void {
        this._insertNewSource(SourceToEntity(newSource));
    }
    deleteSource(sourceId: number): void {
        this._deleteSource(sourceId);
    }
    editSource(sourceId: number, newValue: Source): void {
        this._editSource(sourceId, SourceToEntity(newValue));
    }

    // Results
    getResults(sourceId: number): Result[] {
        const results = this._getResultsForSourceId(sourceId);
        return results.map((r) => ReadResultEntityToModel(r));
    }
    createResult(result: Result): void {
        this._insertNewResult(result);
    }
    deleteResult(resultId: number): void {
        this._deleteResult(resultId);
    }
    editResult(resultId: number, newValue: Result): void {
        this._editResult(resultId, newValue);
    }



    private _getSource(sourceId: number): SourceEntity {
        const stmt = 'SELECT * FROM Sources WHERE id = ?';
        const result = this.db.prepare(stmt).get(sourceId) as SourceEntity;
        console.debug(result);
        return result;
    }
    private _getAllSourcesSummary(): SourceSummaryEntity[] {
        const stmt = `
        SELECT
            Sources.id,
            Sources.title,
            COALESCE(ResultCounts.nb_results, 0) AS nb_results
        FROM
            Sources
        LEFT JOIN (
            SELECT
                source_id,
                COUNT(*) AS nb_results
            FROM Results
            GROUP BY source_id
        ) AS ResultCounts ON Sources.id = ResultCounts.source_id;`;
        const results = this.db.prepare(stmt).all() as SourceSummaryEntity[];
        return results;
    }
    private _insertNewSource(newSource: SourceEntity) {
        console.debug("Inserting new source: ");
        console.debug(newSource);
        const insetStmt = `INSERT INTO Sources (
            type,
            author,
            date,
            publisher,
            location,
            doi, 
            title,
            cohort
            ) VALUES (
                @type,
                @author,
                @date,
                @publisher,
                @location,
                @doi, 
                @title,
                @cohort
            )`;
        this.db.prepare(insetStmt).run(newSource);
    }
    private _editSource(sourceId: number, source: SourceEntity) {
        console.debug(`Editing source ${sourceId} with new value:`);
        console.debug(source);
        const stmt = `
        UPDATE Sources SET 
            type=@type,
            author=@author,
            date=@date,
            publisher=@publisher,
            location=@location,
            doi=@doi,
            title=@title,
            cohort=@cohort
        WHERE id=@sourceId`
        const result = this.db.prepare(stmt).run({ ...source, sourceId: sourceId });
    }
    private _deleteSource(sourceId: number): void {
        const stmt = 'DELETE FROM Sources WHERE id = ?';
        this.db.prepare(stmt).run(sourceId);
    }

    // Results
    // TODO to test and fix
    private _getResultsForSourceId(sourceId: number): ReadResultEntity[] {
        const stmt = `SELECT Results.id,
                             Results.source_id,
                             ROIs.lobe AS roi_lobe,
                             ROIs.gyrus AS roi_gyrus,
                             ROIs.sub AS roi_sub,
                             ROIs.precision AS roi_precision,
                             Results.stim_amp_ma,
                             Results.stim_freq,
                             Results.stim_electrode_separation,
                             Results.stim_duration_ms,
                             Effects.category AS effect_category,
                             Effects.semiology AS effect_semiology,
                             Effects.characteristic AS effect_characteristic,
                             Effects.precision AS effect_precision,
                             Results.effect_post_discharge,
                             Results.occurrences,
                             Results.comments
                        FROM Results 
                        JOIN ROIs ON Results.roi_id = ROIs.id
                        JOIN Effects ON Results.effect_id = Effects.id
                        WHERE source_id = ?`;
        const results = this.db.prepare(stmt).all(sourceId) as ReadResultEntity[];
        return results;
    }

    // TODO: to test
    private _insertNewResult(newResult: Result): void {
        console.debug("Inserting new result: ");
        console.debug(newResult);
        let newRoiId: number = null;
        if (newResult.roi.lobe != '') {
            const getRoiId_stmt = 'SELECT * FROM ROIs WHERE lobe IS @lobe AND gyrus IS @gyrus AND sub IS @sub AND precision IS @precision';
            const roi = this.db.prepare(getRoiId_stmt).get(newResult.roi) as ROIEntity;
            newRoiId = roi.id;
        }
        let newEffectId: number = null;
        if (newResult.effect.category != '') {
            const getEffectId_stmt = 'SELECT id FROM Effects WHERE category IS @category AND semiology IS @semiology AND characteristic IS @characteristic AND precision IS @precision';
            newEffectId = this.db.prepare(getEffectId_stmt).get(newResult.effect) as number;
        }
        console.debug(newEffectId);
        console.debug(newRoiId);
        const stmt = `INSERT INTO Results 
        (source_id, roi_id, stim_amp_ma, stim_freq, stim_electrode_separation, stim_duration_ms, effect_id, effect_post_discharge, occurrences, comments) 
        Values (@source_id,@roi_id,@stim_amp_ma,@stim_freq,@stim_electrode_separation,@stim_duration_ms,@effect_id,@effect_post_discharge,@occurrences,@comments);`
        this.db.prepare(stmt).run({
            source_id: newResult.source_id,
            roi_id: newRoiId,
            stim_amp_ma: newResult.stimulation_parameters.amplitude_ma,
            stim_freq: newResult.stimulation_parameters.frequency_hz,
            stim_electrode_separation: newResult.stimulation_parameters.electrode_separation_mm,
            stim_duration_ms: newResult.stimulation_parameters.duration_s,
            effect_id: newEffectId,
            effect_post_discharge: newResult.effect.post_discharge ? 1 : 0,
            occurrences: newResult.occurrences,
            comments: newResult.comments
        })
    }
    // TODO:  to test
    private _editResult(resultId: number, newResult: Result): void {
        console.debug("Editing result: ");
        console.debug(resultId);
        console.debug(newResult);
        let newRoiId: number = null;
        if (newResult.roi.lobe != null) {
            const getRoiId_stmt = 'SELECT id FROM ROIs WHERE lobe = @lobe AND gyrus = @gyrus AND sub = @sub AND precision = @precision';
            newRoiId = this.db.prepare(getRoiId_stmt).get(newResult.roi) as number;
        }
        let newEffectId: number = null;
        if (newResult.effect.category != null) {
            const getEffectId_stmt = 'SELECT id FROM Effects WHERE category = @category AND semiology = @semiology AND characteristic = @characteristic AND precision = @precision';
            newEffectId = this.db.prepare(getEffectId_stmt).get(newResult.effect) as number;
        }

        const stmt = `
        UPDATE Results SET 
            roi_id = @newRoiId,
            stim_amp_ma = @stim_amp_ma,
            stim_freq = @stim_freq,
            stim_electrode_separation = @stim_electrode_separation,
            stim_duration_ms = @stim_duration_ms,
            effect_id = @newEffectId,
            effect_post_discharge = @effect_post_discharge,
            occurrences,
            comments = @comments
        WHERE id=@resultIdToEdit`
        this.db.prepare(stmt).run({
            roi_id: newRoiId,
            stim_amp_ma: newResult.stimulation_parameters.amplitude_ma,
            stim_freq: newResult.stimulation_parameters.frequency_hz,
            stim_electrode_separation: newResult.stimulation_parameters.electrode_separation_mm,
            stim_duration_ms: newResult.stimulation_parameters.duration_s,
            effect_id: newEffectId,
            effect_post_discharge: newResult.effect.post_discharge,
            occurrences: newResult.occurrences,
            comments: newResult.comments,
            resultIdToEdit: resultId
        });
    }
    private _deleteResult(resultId: number): void {
        const stmt = 'DELETE FROM Results WHERE id = ?';
        this.db.prepare(stmt).run(resultId);
    }


    // ROIs
    private _getROIs(): ROIEntity[] {
        const stmt = `SELECT id, level, lobe, gyrus, sub, precision, parent_id, is_manual FROM ROIs`;
        const rois = this.db.prepare(stmt).all() as ROIEntity[];
        return rois;
    }

    private createTablesIfNotExist() {
        console.debug('Creating tables...');
        this._createSourcesTableIfNotExist();
        this._createResultsTableIfNotExist();
        this._setupROITable();
        this._setupEffectsTable();
    }

    private _createSourcesTableIfNotExist() {
        const createSourcesTableStmt = `
            CREATE TABLE IF NOT EXISTS Sources (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT,
                author TEXT,
                date TEXT,
                publisher TEXT,
                location TEXT,
                doi TEXT, 
                title TEXT,
                cohort INTEGER
            );`;
        this.db.prepare(createSourcesTableStmt).run();
    }
    private _createResultsTableIfNotExist() {
        const createStmt = `
            CREATE TABLE IF NOT EXISTS Results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                source_id INTEGER NOT NULL,
                roi_id INTEGER,
                stim_amp_ma INTEGER,
                stim_freq INTEGER,
                stim_electrode_separation INTEGER,
                stim_duration_ms INTEGER,
                effect_id INTEGER,
                effect_post_discharge INTEGER,
                occurrences INTEGER,
                comments TEXT
            );`;
        this.db.prepare(createStmt).run();
    }
    private _setupROITable() {
        this._createROITableIfNotExist();
        // TODO: load base ROI arborescence in table
    }
    private _createROITableIfNotExist() {
        const createStmt = `
            CREATE TABLE IF NOT EXISTS ROIs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                level TEXT NOT NULL,
                lobe TEXT NOT NULL,
                gyrus TEXT,
                sub TEXT,
                precision TEXT,
                parent_id INTEGER,
                is_manual NUMBER
            );`;
        this.db.prepare(createStmt).run();
    }
    private _setupEffectsTable() {
        this._createEffectsTableIfNotExist();
        // TODO: load base Effects arborescence in table
    }
    private _createEffectsTableIfNotExist() {
        const createStmt = `
            CREATE TABLE IF NOT EXISTS Effects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                level TEXT NOT NULL,
                category TEXT NOT NULL,
                semiology TEXT,
                characteristic TEXT,
                precision TEXT,
                parent_id INTEGER,
                is_manual NUMBER
            );`;
        this.db.prepare(createStmt).run();
    }
}