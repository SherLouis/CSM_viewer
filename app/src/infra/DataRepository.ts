import { Result } from "../core/models/Result";
import { SourceSummary, Source } from "../core/models/Source";
import IDataRepository from "./IDataRepository";
import { SourceEntity, SourceEntityToModel, SourceToEntity } from "./entity/SourceEntity";
import { SourceSummaryEntity, SourceSummaryEntityToModel } from "./entity/SourceSummaryEntity";
import Database from "better-sqlite3";
import { ResultEntity, ResultEntityToModel, ResultToEntity } from "./entity/ResultEntity";
import { EffectArborescence } from "../core/models/EffectArborescence";
import { ROIArborescence } from "../core/models/ROIArborescence";

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
    getROIArborescence(): ROIArborescence {
        throw new Error("Method not implemented.");
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
        return results.map((r) => ResultEntityToModel(r));
    }
    createResult(result: Result): void {
        this._insertNewResult(ResultToEntity(result));
    }
    deleteResult(resultId: number): void {
        this._deleteResult(resultId);
    }
    editResult(resultId: number, newValue: Result): void {
        this._editResult(resultId, ResultToEntity(newValue));
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
            title
            ) VALUES (
                @type,
                @author,
                @date,
                @publisher,
                @location,
                @doi, 
                @title
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
            title=@title
        WHERE id=@sourceDoiToEdit`
        const result = this.db.prepare(stmt).run({ ...source, sourceDoiToEdit: sourceId });
    }
    private _deleteSource(sourceId: number): void {
        const stmt = 'DELETE FROM Sources WHERE id = ?';
        this.db.prepare(stmt).run(sourceId);
    }

    // Results
    private _getResultsForSourceId(sourceId: number): ResultEntity[] {
        const stmt = 'SELECT * FROM Results WHERE source_id = ?';
        const results = this.db.prepare(stmt).all(sourceId) as ResultEntity[];
        return results;
    }

    // TODO: ajust for new model
    private _insertNewResult(newResult: ResultEntity): void {
        console.debug("Inserting new result: ");
        console.debug(newResult);
        const stmt = `INSERT INTO Results 
        (source_id, location_side, location_lobe, location_gyrus, location_broadmann, effect_category, effect_semiology, effect_characteristic, effect_post_discharge, comments) 
        Values (@source_id, @location_side, @location_lobe, @location_gyrus, @location_broadmann, @effect_category, @effect_semiology, @effect_characteristic, @effect_post_discharge, @comments);`
        this.db.prepare(stmt).run(newResult)
    }
    // TODO:  adjust for new model
    private _editResult(resultId: number, newResult: ResultEntity): void {
        console.debug("Editing result: ");
        console.debug(resultId);
        console.debug(newResult);
        const stmt = `
        UPDATE Results SET 
            location_side = @location_side,
            location_lobe = @location_lobe,
            location_gyrus = @location_gyrus,
            location_broadmann = @location_broadmann,
            effect_category = @effect_category,
            effect_semiology = @effect_semiology,
            effect_characteristic = @effect_characteristic,
            effect_post_discharge = @effect_post_discharge,
            comments = @comments
        WHERE id=@resultIdToEdit`
        this.db.prepare(stmt).run({ ...newResult, resultIdToEdit: resultId });
    }
    private _deleteResult(resultId: number): void {
        const stmt = 'DELETE FROM Results WHERE id = ?';
        this.db.prepare(stmt).run(resultId);
    }

    private createTablesIfNotExist() {
        console.debug('Creating tables...');
        this._createSourcesTableIfNotExist();
        this._createResultsTableIfNotExist();
        this._setupROITable();
        this._setupEffectsTable();
        const createResultsTableStmt = `
            CREATE TABLE IF NOT EXISTS Results (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                source_id INTEGER NOT NULL, 
                location_side TEXT NOT NULL, 
                location_lobe TEXT NOT NULL, 
                location_gyrus TEXT NOT NULL, 
                location_broadmann TEXT NOT NULL, 
                effect_category TEXT NOT NULL, 
                effect_semiology TEXT NOT NULL, 
                effect_characteristic TEXT NOT NULL, 
                effect_post_discharge INTEGER NOT NULL, 
                comments TEXT NOT NULL);`;
        this.db.prepare(createResultsTableStmt).run();
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
                title TEXT
            );`;
        this.db.prepare(createSourcesTableStmt).run();
    }
    private _createResultsTableIfNotExist() {
        const createStmt = `
            CREATE TABLE IF NOT EXISTS Results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                source_id INTEGER NOT NULL,
                roi_id INTEGER,
                stim_amp_mA INTEGER,
                stim_freq INTEGER,
                stim_electrode_separation INTEGER,
                stim_duration_ms INTEGER,
                effect_id INTEGER,
                occurrences INTEGER
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
                name TEXT NOT NULL,
                level TEXT NOT NULL,
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
                name TEXT NOT NULL,
                level TEXT NOT NULL,
                parent_id INTEGER,
                is_manual NUMBER
            );`;
        this.db.prepare(createStmt).run();
    }
}