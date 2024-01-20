import { Result } from "../core/models/Result";
import { SourceSummary, Source } from "../core/models/Source";
import IDataRepository from "./IDataRepository";
import { SourceEntity, SourceEntityToModel, SourceToEntity } from "./entity/SourceEntity";
import { SourceSummaryEntity, SourceSummaryEntityToModel } from "./entity/SourceSummaryEntity";
import Database from "better-sqlite3";
import { ReadResultEntity, ReadResultEntityToModel } from "./entity/ResultEntity";
import { ROI } from "../core/models/ROI";
import { Effect } from "../core/models/Effect";
import path = require('path')
import * as fs from 'fs'
import { app } from "electron";
import { Task } from "../core/models/Task";
import { Function } from "../core/models/Function";

export default class DataRepository implements IDataRepository {
    private dbLocation: string;
    private db: Database.Database;

    private rois: ROI[];
    private effects: Effect[];
    private tasks: Task[];
    private functions: Function[];


    constructor(dbLocation: string) {
        this.rois = this.readRoisFromFile();
        this.effects = this.readEffectsFromFile();
        this.tasks = this.readTasksFromFile();
        this.functions = this.readFunctionsFromFile();
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
        return this.rois;
    }

    // Effects
    getEffects(): Effect[] {
        return this.effects;
    }

    // Tasks
    getTasks(): Task[] {
        return this.tasks;
    }

    // Functions
    getFunctions(): Function[] {
        return this.functions;
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
            COALESCE(ResultCounts.nb_results, 0) AS nb_results,
            Sources.state
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
            cohort,
            state
            ) VALUES (
                @type,
                @author,
                @date,
                @publisher,
                @location,
                @doi, 
                @title,
                @cohort,
                @state
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
            cohort=@cohort,
            state=@state
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
                             Results.roi_side,
                             Results.roi_lobe,
                             Results.roi_region,
                             Results.roi_area,
                             Results.roi_from_figure,
                             Results.roi_mni_x,
                             Results.roi_mni_y,
                             Results.roi_mni_z,
                             Results.roi_mni_average,
                             Results.stim_amp_ma,
                             Results.stim_amp_ma_max,
                             Results.stim_freq,
                             Results.stim_freq_max,
                             Results.stim_duration,
                             Results.stim_duration_max,
                             Results.stim_electrode_make,
                             Results.stim_implentation_type,
                             Results.stim_contact_separation,
                             Results.stim_contact_diameter,
                             Results.stim_contact_length,
                             Results.stim_phase_length,
                             Results.stim_phase_type,
                             Results.effect_class,
                             Results.effect_descriptor,
                             Results.effect_details,
                             Results.effect_post_discharge,
                             Results.effect_lateralization,
                             Results.effect_dominant,
                             Results.effect_body_part,
                             Results.effect_comments,
                             Results.task_category,
                             Results.task_subcategory,
                             Results.task_characteristic,
                             Results.task_comments,
                             Results.function_category,
                             Results.function_subcategory,
                             Results.function_characteristic,
                             Results.function_article_designed_for_function,
                             Results.function_comments,
                             Results.occurrences,
                             Results.comments,
                             Results.comments_2,
                             Results.precision_score
                        FROM Results 
                        WHERE source_id = ?`;
        const results = this.db.prepare(stmt).all(sourceId) as ReadResultEntity[];
        return results;
    }

    private _insertNewResult(newResult: Result): void {
        console.debug("Inserting new result: ");
        console.debug(newResult);

        const stmt = `INSERT INTO Results 
        (source_id, roi_side, roi_lobe, roi_region, roi_area, roi_from_figure, roi_mni_x, roi_mni_y, roi_mni_z, roi_mni_average, stim_amp_ma, stim_amp_ma_max, stim_freq, stim_freq_max, stim_duration, stim_duration_max, stim_implentation_type, stim_electrode_make, stim_contact_separation, stim_contact_diameter, stim_contact_length, stim_phase_length, stim_phase_type, effect_class, effect_descriptor, effect_details, effect_post_discharge, effect_lateralization, effect_dominant, effect_body_part, effect_comments, task_category, task_subcategory, task_characteristic, task_comments, function_category, function_subcategory, function_characteristic, function_article_designed_for_function, function_comments, occurrences, comments, comments_2, precision_score)
        Values (@source_id, @roi_side, @roi_lobe, @roi_region, @roi_area, @roi_from_figure, @roi_mni_x, @roi_mni_y, @roi_mni_z, @roi_mni_average, @stim_amp_ma, @stim_amp_ma_max, @stim_freq, @stim_freq_max, @stim_duration, @stim_duration_max, @stim_implentation_type, @stim_electrode_make, @stim_contact_separation, @stim_contact_diameter, @stim_contact_length, @stim_phase_length, @stim_phase_type, @effect_class, @effect_descriptor, @effect_details, @effect_post_discharge, @effect_lateralization, @effect_dominant, @effect_body_part, @effect_comments, @task_category, @task_subcategory, @task_characteristic, @task_comments, @function_category, @function_subcategory, @function_characteristic, @function_article_designed_for_function, @function_comments, @occurrences, @comments, @comments_2, @precision_score)`
        this.db.prepare(stmt).run({
            source_id: newResult.source_id,
            roi_side: newResult.roi.side,
            roi_lobe: newResult.roi.lobe,
            roi_region: newResult.roi.region,
            roi_area: newResult.roi.area,
            roi_from_figure: newResult.roi.from_figure ? 1 : 0,
            roi_mni_x: newResult.roi.mni_x,
            roi_mni_y: newResult.roi.mni_y,
            roi_mni_z: newResult.roi.mni_z,
            roi_mni_average: newResult.roi.mni_average ? 1 : 0,
            stim_amp_ma: newResult.stimulation_parameters.amplitude_ma,
            stim_amp_ma_max: newResult.stimulation_parameters.amplitude_ma_max,
            stim_freq: newResult.stimulation_parameters.frequency_hz,
            stim_freq_max: newResult.stimulation_parameters.frequency_hz_max,
            stim_duration: newResult.stimulation_parameters.duration_s,
            stim_duration_max: newResult.stimulation_parameters.duration_s_max,
            stim_implentation_type: newResult.stimulation_parameters.implentation_type,
            stim_electrode_make: newResult.stimulation_parameters.electrode_make,
            stim_contact_separation: newResult.stimulation_parameters.contact_separation,
            stim_contact_diameter: newResult.stimulation_parameters.contact_diameter,
            stim_contact_length: newResult.stimulation_parameters.contact_length,
            stim_phase_length: newResult.stimulation_parameters.phase_length,
            stim_phase_type: newResult.stimulation_parameters.phase_type,
            effect_class: newResult.effect.class,
            effect_descriptor: newResult.effect.descriptor,
            effect_details: newResult.effect.details,
            effect_post_discharge: newResult.effect.post_discharge,
            effect_lateralization: newResult.effect.lateralization,
            effect_dominant: newResult.effect.dominant,
            effect_body_part: newResult.effect.body_part,
            effect_comments: newResult.effect.comments,
            task_category: newResult.task.category,
            task_subcategory: newResult.task.subcategory,
            task_characteristic: newResult.task.characteristic,
            task_comments: newResult.task.comments,
            function_category: newResult.function.category,
            function_subcategory: newResult.function.subcategory,
            function_characteristic: newResult.function.characteristic,
            function_article_designed_for_function: newResult.function.article_designed_for_function ? 1 : 0,
            function_comments: newResult.function.comments,
            occurrences: newResult.occurrences,
            comments: newResult.comments,
            comments_2: newResult.comments_2,
            precision_score: newResult.precision_score
        })
    }
    private _editResult(resultId: number, newResult: Result): void {
        console.debug("Editing result: ");

        const stmt = `
        UPDATE Results SET 
            roi_side=@roi_side,
            roi_lobe=@roi_lobe,
            roi_region=@roi_region,
            roi_area=@roi_area,
            roi_from_figure=@roi_from_figure,
            roi_mni_x=@roi_mni_x,
            roi_mni_y=@roi_mni_y,
            roi_mni_z=@roi_mni_z,
            roi_mni_average=@roi_mni_average,
            stim_amp_ma=@stim_amp_ma,
            stim_amp_ma_max=@stim_amp_ma_max,
            stim_freq=@stim_freq,
            stim_freq_max=@stim_freq_max,
            stim_duration=@stim_duration,
            stim_duration_max=@stim_duration_max,
            stim_implentation_type=@stim_implentation_type,
            stim_electrode_make=@stim_electrode_make,
            stim_contact_separation=@stim_contact_separation,
            stim_contact_diameter=@stim_contact_diameter,
            stim_contact_length=@stim_contact_length,
            stim_phase_length=@stim_phase_length,
            stim_phase_type=@stim_phase_type,
            effect_class=@effect_class,
            effect_descriptor=@effect_descriptor,
            effect_details=@effect_details,
            effect_post_discharge=@effect_post_discharge,
            effect_lateralization=@effect_lateralization,
            effect_dominant=@effect_dominant,
            effect_body_part=@effect_body_part,
            effect_comments=@effect_comments,
            task_category=@task_category,
            task_subcategory=@task_subcategory,
            task_characteristic=@task_characteristic,
            task_comments=@task_comments,
            function_category=@function_category,
            function_subcategory=@function_subcategory,
            function_characteristic=@function_characteristic,
            function_article_designed_for_function=@function_article_designed_for_function,
            function_comments=@function_comments,
            occurrences=@occurrences,
            comments=@comments,
            comments_2=@comments_2,
            precision_score=@precision_score
        WHERE id=@resultIdToEdit`
        this.db.prepare(stmt).run({
            roi_side: newResult.roi.side,
            roi_lobe: newResult.roi.lobe,
            roi_region: newResult.roi.region,
            roi_area: newResult.roi.area,
            roi_from_figure: newResult.roi.from_figure ? 1 : 0,
            roi_mni_x: newResult.roi.mni_x,
            roi_mni_y: newResult.roi.mni_y,
            roi_mni_z: newResult.roi.mni_z,
            roi_mni_average: newResult.roi.mni_average ? 1 : 0,
            stim_amp_ma: newResult.stimulation_parameters.amplitude_ma,
            stim_amp_ma_max: newResult.stimulation_parameters.amplitude_ma_max,
            stim_freq: newResult.stimulation_parameters.frequency_hz,
            stim_freq_max: newResult.stimulation_parameters.frequency_hz_max,
            stim_duration: newResult.stimulation_parameters.duration_s,
            stim_duration_max: newResult.stimulation_parameters.duration_s_max,
            stim_implentation_type: newResult.stimulation_parameters.implentation_type,
            stim_electrode_make: newResult.stimulation_parameters.electrode_make,
            stim_contact_separation: newResult.stimulation_parameters.contact_separation,
            stim_contact_diameter: newResult.stimulation_parameters.contact_diameter,
            stim_contact_length: newResult.stimulation_parameters.contact_length,
            stim_phase_length: newResult.stimulation_parameters.phase_length,
            stim_phase_type: newResult.stimulation_parameters.phase_type,
            effect_class: newResult.effect.class,
            effect_descriptor: newResult.effect.descriptor,
            effect_details: newResult.effect.details,
            effect_post_discharge: newResult.effect.post_discharge,
            effect_lateralization: newResult.effect.lateralization,
            effect_dominant: newResult.effect.dominant,
            effect_body_part: newResult.effect.body_part,
            effect_comments: newResult.effect.comments,
            task_category: newResult.task.category,
            task_subcategory: newResult.task.subcategory,
            task_characteristic: newResult.task.characteristic,
            task_comments: newResult.task.comments,
            function_category: newResult.function.category,
            function_subcategory: newResult.function.subcategory,
            function_characteristic: newResult.function.characteristic,
            function_article_designed_for_function: newResult.function.article_designed_for_function ? 1 : 0,
            function_comments: newResult.function.comments,
            occurrences: newResult.occurrences,
            comments: newResult.comments,
            resultIdToEdit: resultId,
            comments_2: newResult.comments_2,
            precision_score: newResult.precision_score,
        });
    }
    private _deleteResult(resultId: number): void {
        const stmt = 'DELETE FROM Results WHERE id = ?';
        this.db.prepare(stmt).run(resultId);
    }


    // ROIs
    private readRoisFromFile(): ROI[] {
        let file = path.join(app.getAppPath(), '../..', 'resources', 'base_rois.json');
        if (!fs.existsSync(file)) {
            file = path.join(app.getAppPath(), 'resources', 'base_rois.json');
        }
        const jsonstring = fs.readFileSync(file, 'utf-8');
        const base_rois = JSON.parse(jsonstring) as DataItem[];

        let rois: ROI[] = [];
        for (let lobe of base_rois) {
            rois.push({level: 'lobe', lobe: lobe.name, region: null, area: null});
            for (let region of lobe.children) {
                rois.push({level: 'region', lobe: lobe.name, region: region.name, area: null});
                for (let area of region.children) {
                    rois.push({level: 'area', lobe: lobe.name, region: region.name, area: area.name});
                }
            }
        }

        return rois;
    }


    // Effects
    private readEffectsFromFile(): Effect[] {
        let file = path.join(app.getAppPath(), '../..', 'resources', 'base_effects.json');
        if (!fs.existsSync(file)) {
            file = path.join(app.getAppPath(), 'resources', 'base_effects.json');
        }
        const jsonstring = fs.readFileSync(file, 'utf-8');
        const base_effects = JSON.parse(jsonstring) as DataItem[];

        let effects: Effect[] = [];
        for (let e_class of base_effects) {
            effects.push({level: 'class', class: e_class.name, descriptor: null, details: null});
            for (let descriptor of e_class.children) {
                effects.push({level: 'descriptor', class: e_class.name, descriptor: descriptor.name, details: null});
                for (let details of descriptor.children) {
                    effects.push({level: 'details', class: e_class.name, descriptor: descriptor.name, details: details.name});
                }
            }
        }
        return effects;
    }

    // Tasks
    private readTasksFromFile(): Task[] {
        let file = path.join(app.getAppPath(), '../..', 'resources', 'base_tasks.json');
        if (!fs.existsSync(file)) {
            file = path.join(app.getAppPath(), 'resources', 'base_tasks.json');
        }
        const jsonstring = fs.readFileSync(file, 'utf-8');
        const base_tasks = JSON.parse(jsonstring) as DataItem[];

        let tasks: Task[] = [];
        for (let category of base_tasks) {
            tasks.push({level: 'category', category: category.name, subcategory: null, characteristic: null});
            for (let subcategory of category.children) {
                tasks.push({level: 'subcategory', category: category.name, subcategory: subcategory.name, characteristic: null});
                for (let characteristic of subcategory.children) {
                    tasks.push({level: 'characteristic', category: category.name, subcategory: subcategory.name, characteristic: characteristic.name});
                }
            }
        }
        return tasks;
    }

    // Functions
    private readFunctionsFromFile(): Function[] {
        let file = path.join(app.getAppPath(), '../..', 'resources', 'base_functions.json');
        if (!fs.existsSync(file)) {
            file = path.join(app.getAppPath(), 'resources', 'base_functions.json');
        }
        const jsonstring = fs.readFileSync(file, 'utf-8');
        const base_functions = JSON.parse(jsonstring) as DataItem[];

        let functions: Function[] = [];
        for (let category of base_functions) {
            functions.push({level: 'category', category: category.name, subcategory: null, characteristic: null});
            for (let subcategory of category.children) {
                functions.push({level: 'subcategory', category: category.name, subcategory: subcategory.name, characteristic: null});
                for (let characteristic of subcategory.children) {
                    functions.push({level: 'characteristic', category: category.name, subcategory: subcategory.name, characteristic: characteristic.name});
                }
            }
        }
        return functions;
    }


    // Misc
    private createTablesIfNotExist() {
        console.debug('Creating tables...');
        this._createSourcesTableIfNotExist();
        this._createResultsTableIfNotExist();
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
                cohort INTEGER,
                state TEXT
            );`;
        this.db.prepare(createSourcesTableStmt).run();
    }
    private _createResultsTableIfNotExist() {
        const createStmt = `
            CREATE TABLE IF NOT EXISTS Results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                source_id INTEGER NOT NULL,
                roi_side TEXT,
                roi_lobe TEXT,
                roi_region TEXT,
                roi_area TEXT,
                roi_from_figure INTEGER,
                roi_mni_x REAL,
                roi_mni_y REAL,
                roi_mni_z REAL,
                roi_mni_average INTEGER,
                stim_amp_ma REAL,
                stim_amp_ma_max REAL,
                stim_freq INTEGER,
                stim_freq_max INTEGER,
                stim_duration INTEGER,
                stim_duration_max INTEGER,
                stim_implentation_type TEXT,
                stim_electrode_make TEXT,
                stim_contact_separation INTEGER,
                stim_contact_diameter INTEGER,
                stim_contact_length INTEGER,
                stim_phase_length REAL,
                stim_phase_type TEXT,
                effect_class TEXT,
                effect_descriptor TEXT,
                effect_details TEXT,
                effect_post_discharge INTEGER,
                effect_lateralization TEXT,
                effect_dominant TEXT,
                effect_body_part TEXT,
                effect_comments TEXT,
                task_category TEXT,
                task_subcategory TEXT,
                task_characteristic TEXT,
                task_comments TEXT,
                function_category TEXT,
                function_subcategory TEXT,
                function_characteristic TEXT,
                function_article_designed_for_function INTEGER,
                function_comments TEXT,
                occurrences INTEGER,
                comments TEXT,
                comments_2 TEXT,
                precision_score REAL
            );`;
        this.db.prepare(createStmt).run();
    }
}