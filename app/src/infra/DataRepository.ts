import { Result } from "../core/models/Result";
import { SourceSummary, Source } from "../core/models/Source";
import IDataRepository from "./IDataRepository";
import { SourceEntity, SourceEntityToModel, SourceToEntity } from "./entity/SourceEntity";
import { SourceSummaryEntity, SourceSummaryEntityToModel } from "./entity/SourceSummaryEntity";
import Database from "better-sqlite3";
import { ReadResultEntity, ReadResultEntityToModel } from "./entity/ResultEntity";
import { ROI } from "../core/models/ROI";
import { ROIEntity, ROIEntityToModel } from "./entity/ROIEntity";
import { Effect } from "../core/models/Effect";
import path = require('path')
import * as fs from 'fs'
import { app } from "electron";
import { EffectEntity, EffectEntityToModel } from "./entity/EffectEntity";
import { TaskEntity, TaskEntityToModel } from "./entity/TaskEntity";
import { FunctionEntity, FunctionEntityToModel } from "./entity/FunctionEntity";
import { Task } from "../core/models/Task";
import { Function } from "../core/models/Function";

export default class DataRepository implements IDataRepository {
    private dbLocation: string;
    private db: Database.Database;

    constructor(dbLocation: string) {
        this.dbLocation = dbLocation;
        this.db = new Database(this.dbLocation);
        this.createTablesIfNotExist();
    }

    // DB management
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
    getROIs(): ROI[] {
        const entities = this._getROIs();
        return entities.map((e) => ROIEntityToModel(e));
    }

    // Effects
    getEffects(): Effect[] {
        const entities = this._getEffects();
        return entities.map((e) => EffectEntityToModel(e));
    }

    // Tasks
    getTasks(): Task[] {
        const entities = this._getTasks();
        return entities.map((e) => TaskEntityToModel(e));
    }

    // Functions
    getFunctions(): Function[] {
        const entities = this._getFunctions();
        return entities.map((e) => FunctionEntityToModel(e));
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
                             Results.effect_post_discharge AS effect_post_discharge,
                             Tasks.category AS task_category,
                             Tasks.subcategory AS task_subcategory,
                             Tasks.characteristic AS task_characteristic,
                             Tasks.precision AS task_precision,
                             Functions.category AS function_category,
                             Functions.subcategory AS function_subcategory,
                             Functions.characteristic AS function_characteristic,
                             Functions.precision AS function_precision,
                             Results.occurrences,
                             Results.comments
                        FROM Results 
                        LEFT JOIN ROIs ON Results.roi_id = ROIs.id
                        LEFT JOIN Effects ON Results.effect_id = Effects.id
                        LEFT JOIN Tasks ON Results.task_id = Tasks.id
                        LEFT JOIN Functions ON Results.function_id = Functions.id
                        WHERE source_id = ?`;
        const results = this.db.prepare(stmt).all(sourceId) as ReadResultEntity[];
        return results;
    }

    private _insertNewResult(newResult: Result): void {
        console.debug("Inserting new result: ");
        console.debug(newResult);
        let newRoiId: number = null;
        if (newResult.roi.lobe != null) {
            newRoiId = this._getROIIdOrInsertNewManual(newResult);
        }
        let newEffectId: number = null;
        if (newResult.effect.category != null) {
            newEffectId = this._getEffectIdOrInsertNewManual(newResult);
        }
        let newTaskId: number = null;
        if (newResult.task.category != null) {
            newTaskId = this._getTaskIdOrInsertNewManual(newResult);
        }
        let newFunctionId: number = null;
        if (newResult.function.category != null) {
            newFunctionId = this._getFunctionIdOrInsertNewManual(newResult);
        }

        const stmt = `INSERT INTO Results 
        (source_id, roi_id, stim_amp_ma, stim_freq, stim_electrode_separation, stim_duration_ms, effect_id, effect_post_discharge, task_id, function_id, occurrences, comments) 
        Values (@source_id,@roi_id,@stim_amp_ma,@stim_freq,@stim_electrode_separation,@stim_duration_ms,@effect_id,@effect_post_discharge,@task_id,@function_id,@occurrences,@comments);`
        this.db.prepare(stmt).run({
            source_id: newResult.source_id,
            roi_id: newRoiId,
            stim_amp_ma: newResult.stimulation_parameters.amplitude_ma,
            stim_freq: newResult.stimulation_parameters.frequency_hz,
            stim_electrode_separation: newResult.stimulation_parameters.electrode_separation_mm,
            stim_duration_ms: newResult.stimulation_parameters.duration_s,
            effect_id: newEffectId,
            effect_post_discharge: newResult.effect.post_discharge ? 1 : 0,
            task_id: newTaskId,
            function_id: newFunctionId,
            occurrences: newResult.occurrences,
            comments: newResult.comments
        })
    }
    private _editResult(resultId: number, newResult: Result): void {
        console.debug("Editing result: ");
        let newRoiId: number = null;
        if (newResult.roi.lobe != null) {
            newRoiId = newRoiId = this._getROIIdOrInsertNewManual(newResult);
        }
        let newEffectId: number = null;
        if (newResult.effect.category != null) {
            newEffectId = this._getEffectIdOrInsertNewManual(newResult);
        }
        let newTaskId: number = null;
        if (newResult.task.category != null) {
            newTaskId = this._getTaskIdOrInsertNewManual(newResult);
        }
        let newFunctionId: number = null;
        if (newResult.function.category != null) {
            newFunctionId = this._getFunctionIdOrInsertNewManual(newResult);
        }

        const stmt = `
        UPDATE Results SET 
            roi_id = @roi_id,
            stim_amp_ma = @stim_amp_ma,
            stim_freq = @stim_freq,
            stim_electrode_separation = @stim_electrode_separation,
            stim_duration_ms = @stim_duration_ms,
            effect_id = @effect_id,
            effect_post_discharge = @effect_post_discharge,
            task_id = @task_id,
            function_id = @function_id,
            occurrences=@occurrences,
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
            task_id: newTaskId,
            function_id: newFunctionId,
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
    private _insertROI(level: string, lobe: string, gyrus: string, sub: string, precision: string, parent_id: number, is_manual: boolean): number {
        const stmt = `INSERT INTO ROIs 
        (level, lobe, gyrus, sub, precision, parent_id, is_manual) 
        Values (@level, @lobe, @gyrus, @sub, @precision, @parent_id, @is_manual)`;
        const info = this.db.prepare(stmt).run({ level: level, lobe: lobe, gyrus: gyrus, sub: sub, precision: precision, parent_id: parent_id, is_manual: is_manual ? 1 : 0 });
        return info.lastInsertRowid as number;
    }
    private _getROIIdOrInsertNewManual(result: Result): number {
        const getRoiId_stmt = 'SELECT * FROM ROIs WHERE lobe IS @lobe AND gyrus IS @gyrus AND sub IS @sub AND precision IS @precision';
        const roi = this.db.prepare(getRoiId_stmt).get(result.roi) as ROIEntity;
        if (!roi) {
            const level = result.roi.precision != null ? 'precision' : (result.roi.sub != null ? 'sub' : (result.roi.gyrus != null ? 'gyrus' : 'lobe'));
            const parent_level = result.roi.precision != null ? 'sub' : (result.roi.sub != null ? 'gyrus' : 'lobe');
            const parent_value = level === 'precision' ? result.roi.sub : (level === 'sub' ? result.roi.gyrus : (level === 'gyrus' ? result.roi.lobe : null));
            const parent_id = (this.db.prepare(`SELECT * FROM ROIs WHERE level=@level AND ${parent_level}=@value`).get({ level: parent_level, value: parent_value }) as ROIEntity).id;
            return this._insertROI(level, result.roi.lobe, result.roi.gyrus, result.roi.sub, result.roi.precision, parent_id, true);
        }
        return roi.id
    }
    private _setupROITable() {
        if (!this._tableExists('ROIs')) {
            this._createROITableIfNotExist();
            let file = path.join(app.getAppPath(), '../..', 'resources', 'base_rois.json');
            if (!fs.existsSync(file)) {
                file = path.join(app.getAppPath(), 'resources', 'base_rois.json');
            }
            const jsonstring = fs.readFileSync(file, 'utf-8');
            const base_rois = JSON.parse(jsonstring) as DataItem[];

            for (let lobe of base_rois) {
                let lobe_id = this._insertROI('lobe', lobe.name, null, null, null, null, false);
                for (let gyrus of lobe.children) {
                    let gyrus_id = this._insertROI('gyrus', lobe.name, gyrus.name, null, null, lobe_id, false);
                    for (let sub of gyrus.children) {
                        let sub_id = this._insertROI('sub', lobe.name, gyrus.name, sub.name, null, gyrus_id, false);
                        for (let precision of sub.children) {
                            let precision_id = this._insertROI('precision', lobe.name, gyrus.name, sub.name, precision.name, sub_id, false);
                        }
                    }
                }
            }
        }
    }


    // Effects
    private _getEffects(): EffectEntity[] {
        const stmt = `SELECT id, level, category, semiology, characteristic, precision, parent_id, is_manual FROM Effects`;
        const effects = this.db.prepare(stmt).all() as EffectEntity[];
        return effects;
    }
    private _insertEffect(level: string, category: string, semiology: string, characteristic: string, precision: string, parent_id: number, is_manual: boolean): number {
        const stmt = `INSERT INTO Effects 
        (level, category, semiology, characteristic, precision, parent_id, is_manual) 
        Values (@level, @category, @semiology, @characteristic, @precision, @parent_id, @is_manual)`;
        const info = this.db.prepare(stmt).run({ level: level, category: category, semiology: semiology, characteristic: characteristic, precision: precision, parent_id: parent_id, is_manual: is_manual ? 1 : 0 });
        return info.lastInsertRowid as number;
    }
    private _getEffectIdOrInsertNewManual(result: Result): number {
        const getEffectId_stmt = 'SELECT * FROM Effects WHERE category IS @category AND semiology IS @semiology AND characteristic IS @characteristic AND precision IS @precision';
        const effect = this.db.prepare(getEffectId_stmt).get(result.effect) as EffectEntity;
        if (!effect) {
            const level = result.effect.precision != null ? 'precision' : (result.effect.characteristic != null ? 'characteristic' : (result.effect.semiology != null ? 'semiology' : 'category'));
            const parent_level = result.effect.precision != null ? 'characteristic' : (result.effect.characteristic != null ? 'semiology' : 'category');
            const parent_value = level === 'precision' ? result.effect.characteristic : (level === 'characteristic' ? result.effect.semiology : (level === 'semiology' ? result.effect.category : null));
            const parent_id = (this.db.prepare(`SELECT * FROM Effects WHERE level=@level AND ${parent_level}=@value`).get({ level: parent_level, value: parent_value }) as EffectEntity).id;
            return this._insertEffect(level, result.effect.category, result.effect.semiology, result.effect.characteristic, result.effect.precision, parent_id, true);
        }
        return effect.id
    }
    private _setupEffectsTable() {
        if (!this._tableExists('Effects')) {
            this._createEffectsTableIfNotExist();

            let file = path.join(app.getAppPath(), '../..', 'resources', 'base_effects.json');
            if (!fs.existsSync(file)) {
                file = path.join(app.getAppPath(), 'resources', 'base_effects.json');
            }
            const jsonstring = fs.readFileSync(file, 'utf-8');
            const base_effects = JSON.parse(jsonstring) as DataItem[];

            for (let category of base_effects) {
                let category_id = this._insertEffect('category', category.name, null, null, null, null, false);
                for (let semiology of category.children) {
                    let semiology_id = this._insertEffect('semiology', category.name, semiology.name, null, null, category_id, false);
                    for (let characteristic of semiology.children) {
                        let characteristic_id = this._insertEffect('characteristic', category.name, semiology.name, characteristic.name, null, semiology_id, false);
                        for (let precision of characteristic.children) {
                            let precision_id = this._insertEffect('precision', category.name, semiology.name, characteristic.name, precision.name, characteristic_id, false);
                        }
                    }
                }
            }
        }
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

    // Tasks
    private _getTasks(): TaskEntity[] {
        const stmt = `SELECT id, level, category, subcategory, characteristic, precision, parent_id, is_manual FROM Tasks`;
        const tasks = this.db.prepare(stmt).all() as TaskEntity[];
        return tasks;
    }
    private _insertTask(level: string, category: string, subcategory: string, characteristic: string, precision: string, parent_id: number, is_manual: boolean): number {
        const stmt = `INSERT INTO Tasks 
        (level, category, subcategory, characteristic, precision, parent_id, is_manual) 
        Values (@level, @category, @subcategory, @characteristic, @precision, @parent_id, @is_manual)`;
        const info = this.db.prepare(stmt).run({ level: level, category: category, subcategory: subcategory, characteristic: characteristic, precision: precision, parent_id: parent_id, is_manual: is_manual ? 1 : 0 });
        return info.lastInsertRowid as number;
    }
    private _getTaskIdOrInsertNewManual(result: Result): number {
        const getTaskId_stmt = 'SELECT * FROM Tasks WHERE category IS @category AND subcategory IS @subcategory AND characteristic IS @characteristic AND precision IS @precision';
        const task = this.db.prepare(getTaskId_stmt).get(result.task) as TaskEntity;
        if (!task) {
            const level = result.task.precision != null ? 'precision' : (result.task.characteristic != null ? 'characteristic' : (result.task.subcategory != null ? 'subcategory' : 'category'));
            const parent_level = result.task.precision != null ? 'characteristic' : (result.task.characteristic != null ? 'subcategory' : 'category');
            const parent_value = level === 'precision' ? result.task.characteristic : (level === 'characteristic' ? result.task.subcategory : (level === 'subcategory' ? result.task.category : null));
            const parent_id = (this.db.prepare(`SELECT * FROM Tasks WHERE level=@level AND ${parent_level}=@value`).get({ level: parent_level, value: parent_value }) as TaskEntity).id;
            return this._insertTask(level, result.task.category, result.task.subcategory, result.task.characteristic, result.task.precision, parent_id, true);
        }
        return task.id
    }
    private _setupTasksTable() {
        if (!this._tableExists('Tasks')) {
            this._createTasksTableIfNotExist();

            let file = path.join(app.getAppPath(), '../..', 'resources', 'base_tasks.json');
            if (!fs.existsSync(file)) {
                file = path.join(app.getAppPath(), 'resources', 'base_tasks.json');
            }
            const jsonstring = fs.readFileSync(file, 'utf-8');
            const base_tasks = JSON.parse(jsonstring) as DataItem[];

            for (let category of base_tasks) {
                let category_id = this._insertTask('category', category.name, null, null, null, null, false);
                for (let subcategory of category.children) {
                    let subcategory_id = this._insertTask('subcategory', category.name, subcategory.name, null, null, category_id, false);
                    for (let characteristic of subcategory.children) {
                        let characteristic_id = this._insertTask('characteristic', category.name, subcategory.name, characteristic.name, null, subcategory_id, false);
                        for (let precision of characteristic.children) {
                            let precision_id = this._insertTask('precision', category.name, subcategory.name, characteristic.name, precision.name, characteristic_id, false);
                        }
                    }
                }
            }
        }
    }

    // Functions
    private _getFunctions(): FunctionEntity[] {
        const stmt = `SELECT id, level, category, subcategory, characteristic, precision, parent_id, is_manual FROM Functions`;
        const tasks = this.db.prepare(stmt).all() as FunctionEntity[];
        return tasks;
    }
    private _insertFunction(level: string, category: string, subcategory: string, characteristic: string, precision: string, parent_id: number, is_manual: boolean): number {
        const stmt = `INSERT INTO Functions 
        (level, category, subcategory, characteristic, precision, parent_id, is_manual) 
        Values (@level, @category, @subcategory, @characteristic, @precision, @parent_id, @is_manual)`;
        const info = this.db.prepare(stmt).run({ level: level, category: category, subcategory: subcategory, characteristic: characteristic, precision: precision, parent_id: parent_id, is_manual: is_manual ? 1 : 0 });
        return info.lastInsertRowid as number;
    }
    private _getFunctionIdOrInsertNewManual(result: Result): number {
        const getFunctionId_stmt = 'SELECT * FROM Functions WHERE category IS @category AND subcategory IS @subcategory AND characteristic IS @characteristic AND precision IS @precision';
        const func = this.db.prepare(getFunctionId_stmt).get(result.function) as FunctionEntity;
        if (!func) {
            const level = result.function.precision != null ? 'precision' : (result.function.characteristic != null ? 'characteristic' : (result.function.subcategory != null ? 'subcategory' : 'category'));
            const parent_level = result.function.precision != null ? 'characteristic' : (result.function.characteristic != null ? 'subcategory' : 'category');
            const parent_value = level === 'precision' ? result.function.characteristic : (level === 'characteristic' ? result.function.subcategory : (level === 'subcategory' ? result.function.category : null));
            const parent_id = (this.db.prepare(`SELECT * FROM Functions WHERE level=@level AND ${parent_level}=@value`).get({ level: parent_level, value: parent_value }) as TaskEntity).id;
            return this._insertFunction(level, result.function.category, result.function.subcategory, result.function.characteristic, result.function.precision, parent_id, true);
        }
        return func.id
    }
    private _setupFunctionsTable() {
        if (!this._tableExists('Functions')) {
            this._createFunctionsTableIfNotExist();

            let file = path.join(app.getAppPath(), '../..', 'resources', 'base_functions.json');
            if (!fs.existsSync(file)) {
                file = path.join(app.getAppPath(), 'resources', 'base_functions.json');
            }
            const jsonstring = fs.readFileSync(file, 'utf-8');
            const base_functions = JSON.parse(jsonstring) as DataItem[];

            for (let category of base_functions) {
                let category_id = this._insertFunction('category', category.name, null, null, null, null, false);
                for (let subcategory of category.children) {
                    let subcategory_id = this._insertFunction('subcategory', category.name, subcategory.name, null, null, category_id, false);
                    for (let characteristic of subcategory.children) {
                        let characteristic_id = this._insertFunction('characteristic', category.name, subcategory.name, characteristic.name, null, subcategory_id, false);
                        for (let precision of characteristic.children) {
                            let precision_id = this._insertFunction('precision', category.name, subcategory.name, characteristic.name, precision.name, characteristic_id, false);
                        }
                    }
                }
            }
        }
    }


    // Misc
    private createTablesIfNotExist() {
        console.debug('Creating tables...');
        this._createSourcesTableIfNotExist();
        this._createResultsTableIfNotExist();
        this._setupROITable();
        this._setupEffectsTable();
        this._setupTasksTable();
        this._setupFunctionsTable();
    }
    private _tableExists(table: string) {
        const stmt = `SELECT count(*) AS count FROM sqlite_master WHERE type='table' AND name=?;`
        const result = this.db.prepare(stmt).get(table) as { count: number };
        return (result.count > 0)
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
                task_id INTEGER,
                function_id INTEGER,
                occurrences INTEGER,
                comments TEXT
            );`;
        this.db.prepare(createStmt).run();
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
    private _createTasksTableIfNotExist() {
        const createStmt = `
        CREATE TABLE IF NOT EXISTS Tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            level TEXT NOT NULL,
            category TEXT NOT NULL,
            subcategory TEXT,
            characteristic TEXT,
            precision TEXT,
            parent_id INTEGER,
            is_manual NUMBER
        );`;
        this.db.prepare(createStmt).run();
    }
    private _createFunctionsTableIfNotExist() {
        const createStmt = `
        CREATE TABLE IF NOT EXISTS Functions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            level TEXT NOT NULL,
            category TEXT NOT NULL,
            subcategory TEXT,
            characteristic TEXT,
            precision TEXT,
            parent_id INTEGER,
            is_manual NUMBER
        );`;
        this.db.prepare(createStmt).run();
    }
}