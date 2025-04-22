import { Result } from "../core/models/Result";
import { SourceSummary, Source } from "../core/models/Source";
import IDataRepository from "../core/IDataRepository";
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
import { createObjectCsvWriter } from "csv-writer";

export default class SqlDataRepository implements IDataRepository {
    private dbLocation: string;
    private db: Database.Database;

    private rois: ROI[];
    private effects: Effect[];
    private tasks: Task[];
    private functions: Function[];
    private bodyParts: string[];


    constructor(dbLocation: string) {
        this.rois = this.readRoisFromFile();
        this.effects = this.readEffectsFromFile();
        this.tasks = this.readTasksFromFile();
        this.functions = this.readFunctionsFromFile();
        this.bodyParts = this.readBodyPartsFromFile();
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

    migrateDb(newDbLocation: string): boolean {
        interface TableSchema {
            sql: string;
        }

        interface TableInfo {
            name: string;
        }

        // Open the source and destination databases
        const srcDb = this.db;
        const destDb = new Database(newDbLocation);

        try {
            // Retrieve the schema from the source database
            const tables = srcDb.prepare("SELECT name FROM sqlite_master WHERE type='table'").all() as TableInfo[];

            for (const table of tables) {
                const tableName = table.name;  // TypeScript now knows table has a 'name' property

                // Skip the 'sqlite_sequence' table
                if (tableName === 'sqlite_sequence') {
                    continue;
                }

                // Get the schema of each table
                const schema = srcDb.prepare(`SELECT sql FROM sqlite_master WHERE type='table' AND name=?`).get(tableName) as TableSchema;
                if (schema && schema.sql) {
                    // Create the table in the destination database
                    destDb.exec(schema.sql);

                    // Copy data from the source table to the destination table
                    const rows: Record<string, any>[] = srcDb.prepare(`SELECT * FROM ${tableName}`).all();
                    if (rows.length > 0) {
                        const columns = Object.keys(rows[0]).join(',');
                        const placeholders = Object.keys(rows[0]).map(() => '?').join(',');
                        const insertSQL = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
                        const insertStmt = destDb.prepare(insertSQL);

                        // Insert rows into the new database
                        for (const row of rows) {
                            insertStmt.run(Object.values(row));
                        }
                    }
                }
            }

            console.log(`Database migrated from ${this.dbLocation} to ${newDbLocation}`);
            this.db.close();
            this.db = destDb;
            this.dbLocation = newDbLocation;
            return true;
        } catch (error) {
            console.error('Error migrating database:', error);
            return false;
        }
    }

    mergeWith(mergeWithDbLocation: string, saveResultInDbLocation: string): boolean {
        const getFilename = (path: string) => { return path.split('\\').pop().split('/').pop() };
        try {
            const resultDb = new Database(saveResultInDbLocation);
            const otherDb = new Database(mergeWithDbLocation);

            // Create tables in resultDb
            const createSourcesTableStmt = `
                    CREATE TABLE IF NOT EXISTS Sources (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        author TEXT,
                        date TEXT,
                        publisher TEXT,
                        doi TEXT, 
                        title TEXT,
                        cohort INTEGER,
                        state TEXT
                    );`;
            const createResultsTableStmt = `
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
                        stim_amp_ma_min REAL,
                        stim_amp_ma_max REAL,
                        stim_amp_ma_avg REAL,
                        stim_freq INTEGER,
                        stim_freq_max INTEGER,
                        stim_duration INTEGER,
                        stim_duration_max INTEGER,
                        stim_implantation_type TEXT,
                        stim_electrode_make TEXT,
                        stim_contact_separation INTEGER,
                        stim_contact_diameter INTEGER,
                        stim_contact_length INTEGER,
                        stim_phase_length REAL,
                        stim_phase_type TEXT,
                        stim_epi_zone TEXT,
                        stim_epi_zone_comments TEXT,
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
                        precision_score REAL,
                        clinical_semiology TEXT,
                        source_db TEXT
                    );`;
            resultDb.prepare(createSourcesTableStmt).run();
            resultDb.prepare(createResultsTableStmt).run();

            // Maps
            const doiToFinalSourceIdMap = new Map<string, number>();
            const sourceIdAToFinalSourceIdMap = new Map<number, number>();
            const sourceIdBToFinalSourceIdMap = new Map<number, number>();

            // Insert sources from database A into database C
            const insertSource = resultDb.prepare(`
        INSERT INTO Sources (author, date, publisher, doi, title, cohort, state)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

            const sourcesA = this.db.prepare('SELECT * FROM Sources').all() as SourceEntity[];
            sourcesA.forEach(source => {
                const info = insertSource.run(source.author, source.date, source.publisher, source.doi, source.title, source.cohort, source.state);
                if (source.doi) {
                    doiToFinalSourceIdMap.set(source.doi, info.lastInsertRowid as number);
                }
                sourceIdAToFinalSourceIdMap.set(source.id, info.lastInsertRowid as number);
            });

            // Merge Sources from database B into database C
            const sourcesB = otherDb.prepare('SELECT * FROM Sources').all() as SourceEntity[];
            sourcesB.forEach(source => {
                if (source.doi && doiToFinalSourceIdMap.has(source.doi)) {
                    // If DOI exists, then source already inserted in result db
                    sourceIdBToFinalSourceIdMap.set(source.id, doiToFinalSourceIdMap.get(source.doi));
                } else {
                    // Insert new source into result database and get new ID
                    const info = insertSource.run(source.author, source.date, source.publisher, source.doi, source.title, source.cohort, source.state);
                    const newSourceId = info.lastInsertRowid as number;
                    if (source.doi) {
                        doiToFinalSourceIdMap.set(source.doi, newSourceId);
                    }
                    sourceIdBToFinalSourceIdMap.set(source.id, newSourceId);
                }
            });

            // Prepare to insert Results into result database
            const insertResult = resultDb.prepare(`
        INSERT INTO Results 
        (source_id, roi_side, roi_lobe, roi_region, roi_area, roi_from_figure, roi_mni_x, roi_mni_y, roi_mni_z, roi_mni_average, stim_amp_ma_min, stim_amp_ma_max, stim_amp_ma_avg, stim_freq, stim_freq_max, stim_duration, stim_duration_max, stim_implantation_type, stim_electrode_make, stim_contact_separation, stim_contact_diameter, stim_contact_length, stim_phase_length, stim_phase_type, stim_epi_zone, stim_epi_zone_comments, effect_class, effect_descriptor, effect_details, effect_post_discharge, effect_lateralization, effect_dominant, effect_body_part, effect_comments, task_category, task_subcategory, task_characteristic, task_comments, function_category, function_subcategory, function_characteristic, function_article_designed_for_function, function_comments, occurrences, comments, comments_2, precision_score, clinical_semiology, source_db)
        Values (@source_id, @roi_side, @roi_lobe, @roi_region, @roi_area, @roi_from_figure, @roi_mni_x, @roi_mni_y, @roi_mni_z, @roi_mni_average, @stim_amp_ma_min, @stim_amp_ma_max, @stim_amp_ma_avg, @stim_freq, @stim_freq_max, @stim_duration, @stim_duration_max, @stim_implantation_type, @stim_electrode_make, @stim_contact_separation, @stim_contact_diameter, @stim_contact_length, @stim_phase_length, @stim_phase_type, @stim_epi_zone, @stim_epi_zone_comments, @effect_class, @effect_descriptor, @effect_details, @effect_post_discharge, @effect_lateralization, @effect_dominant, @effect_body_part, @effect_comments, @task_category, @task_subcategory, @task_characteristic, @task_comments, @function_category, @function_subcategory, @function_characteristic, @function_article_designed_for_function, @function_comments, @occurrences, @comments, @comments_2, @precision_score, @clinical_semiology, @source_db)
        `);
            // Merge Results from database A
            const resultsA = this.db.prepare('SELECT * FROM Results').all() as ReadResultEntity[];
            resultsA.forEach(result => {
                const newSourceId = sourceIdAToFinalSourceIdMap.get(result.source_id);
                const sourceDatabase = getFilename(this.dbLocation);
                insertResult.run({
                    ...result,
                    source_id: newSourceId,
                    source_db: sourceDatabase
                })
            });

            // Merge Results from database B
            const resultsB = otherDb.prepare('SELECT * FROM Results').all() as ReadResultEntity[];
            resultsB.forEach(result => {
                const newSourceId = sourceIdBToFinalSourceIdMap.get(result.source_id);
                const sourceDatabase = getFilename(mergeWithDbLocation);
                insertResult.run({
                    ...result,
                    source_id: newSourceId,
                    source_db: sourceDatabase
                })
            });

            // Close databases and switch to new one
            this.db.close();
            otherDb.close();
            this.db = resultDb;
            this.dbLocation = saveResultInDbLocation;

            return true;
        }

        catch (error) {
            console.error('Error merging databases');
            return false;
        }
    }

    async exportToCsv(exportCsvFilePath: string): Promise<void> {
        // Query to join Results and Sources tables
        const query = `
        SELECT S.author, S.date, S.publisher, S.doi, S.title, S.cohort, S.state,
        R.roi_side, R.roi_lobe, R.roi_region, R.roi_area, R.roi_from_figure, R.roi_mni_x, R.roi_mni_y, R.roi_mni_z, R.roi_mni_average, 
        R.stim_amp_ma_min, R.stim_amp_ma_max, R.stim_amp_ma_avg, R.stim_freq, R.stim_freq_max, R.stim_duration, R.stim_duration_max, R.stim_electrode_make, R.stim_implantation_type, R.stim_contact_separation, R.stim_contact_diameter, R.stim_contact_length, R.stim_phase_length, R.stim_phase_type, R.stim_epi_zone, R.stim_epi_zone_comments,
        R.effect_class, R.effect_descriptor, R.effect_details, R.effect_post_discharge, R.effect_lateralization, R.effect_dominant, R.effect_body_part, R.effect_comments, 
        R.task_category, R.task_subcategory, R.task_characteristic, R.task_comments, 
        R.function_category, R.function_subcategory, R.function_characteristic, R.function_article_designed_for_function, R.function_comments, 
        R.occurrences, R.comments, R.comments_2, R.precision_score, R.clinical_semiology
        FROM Results R
        JOIN Sources S ON R.source_id = S.id
    `;

        // Fetch the results
        const results = this.db.prepare(query).all();

        // Define CSV writer
        const csvWriter = createObjectCsvWriter({
            path: exportCsvFilePath,
            header: [
                { id: 'author', title: 'Source Author' },
                { id: 'date', title: 'Source date' },
                { id: 'publisher', title: 'Source publisher' },
                { id: 'doi', title: 'Source DOI' },
                { id: 'cohort', title: 'Cohort' },
                { id: 'title', title: 'Source Title' },
                { id: 'state', title: 'Source state' },
                { id: 'roi_side', title: 'ROI side' },
                { id: 'roi_lobe', title: 'ROI lobe' },
                { id: 'roi_region', title: 'ROI region' },
                { id: 'roi_area', title: 'ROI area' },
                { id: 'roi_from_figure', title: 'ROI selected from figure' },
                { id: 'roi_mni_x', title: 'ROI MNI X' },
                { id: 'roi_mni_y', title: 'ROI MNI Y' },
                { id: 'roi_mni_z', title: 'ROI MNI Z' },
                { id: 'roi_mni_average', title: 'ROI MNI is average' },
                { id: 'stim_amp_ma_min', title: 'Stimulation Minimum Amplitude (mA)' },
                { id: 'stim_amp_ma_max', title: 'Stimulation Maximum Amplitude (mA)' },
                { id: 'stim_amp_ma_avg', title: 'Stimulation Average Amplitude (mA)' },
                { id: 'stim_freq', title: 'Stimulation Frequency (Hz)' },
                { id: 'stim_freq_max', title: 'Stimulation Maximum Frequency (Hz)' },
                { id: 'stim_duration', title: 'Stimulation Duration' },
                { id: 'stim_duration_max', title: 'Stimulation Maximum Duration' },
                { id: 'stim_electrode_make', title: 'Electrode Make' },
                { id: 'stim_implantation_type', title: 'Implentation Type' },
                { id: 'stim_contact_separation', title: 'Contact Separation' },
                { id: 'stim_contact_diameter', title: 'Contact Diameter' },
                { id: 'stim_contact_length', title: 'Contact Lenght' },
                { id: 'stim_phase_length', title: 'Phase Length' },
                { id: 'stim_phase_type', title: 'Phase Type' },
                { id: 'stim_epi_zone', title: 'Épileptogenic Zone' },
                { id: 'stim_epi_zone_comments', title: 'Épileptogenic Zone Comments' },
                { id: 'effect_class', title: 'Effect class' },
                { id: 'effect_descriptor', title: 'Effect Descriptor' },
                { id: 'effect_details', title: 'Effect Details' },
                { id: 'effect_post_discharge', title: 'Post Discharge' },
                { id: 'effect_lateralization', title: 'Effect Lateralization' },
                { id: 'effect_dominant', title: 'Effect Dominance' },
                { id: 'effect_body_part', title: 'Effect Body Part' },
                { id: 'effect_comments', title: 'Effect Comments' },
                { id: 'task_category', title: 'Task Category' },
                { id: 'task_subcategory', title: 'Task Subcategory' },
                { id: 'task_characteristic', title: 'Task Characteristic' },
                { id: 'task_comments', title: 'Task Comments' },
                { id: 'function_category', title: 'Function Category' },
                { id: 'function_subcategory', title: 'Function Subcategory' },
                { id: 'function_characteristic', title: 'Function Characteristic' },
                { id: 'function_article_designed_for_function', title: 'Article Designed For Function' },
                { id: 'function_comments', title: 'Function Comments' },
                { id: 'occurrences', title: 'Occurences' },
                { id: 'comments', title: 'Comments' },
                { id: 'comments_2', title: 'Comments 2' },
                { id: 'precision_score', title: 'Precision Score' },
                { id: 'clinical_semiology', title: 'Clinical Semiology' }
            ],
        });

        // Write data to CSV
        await csvWriter.writeRecords(results);
        console.log(`Exported data to ${exportCsvFilePath}`);
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

    // Body Parts
    getBodyParts(): string[] {
        return this.bodyParts;
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
        console.debug("Inserting new source ");
        const insetStmt = `INSERT INTO Sources (
            author,
            date,
            publisher,
            doi, 
            title,
            cohort,
            state
            ) VALUES (
                @author,
                @date,
                @publisher,
                @doi, 
                @title,
                @cohort,
                @state
            )`;
        this.db.prepare(insetStmt).run(newSource);
    }
    private _editSource(sourceId: number, source: SourceEntity) {
        console.debug(`Editing source ${sourceId} with new value`);
        const stmt = `
        UPDATE Sources SET 
            author=@author,
            date=@date,
            publisher=@publisher,
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
        const stmt = `SELECT * FROM Results WHERE source_id = ?`;
        const results = this.db.prepare(stmt).all(sourceId) as ReadResultEntity[];
        return results;
    }

    private _insertNewResult(newResult: Result): void {
        console.debug("Inserting new result");

        const stmt = `INSERT INTO Results 
        (source_id, roi_side, roi_lobe, roi_region, roi_area, roi_from_figure, roi_mni_x, roi_mni_y, roi_mni_z, roi_mni_average, stim_amp_ma_min, stim_amp_ma_max, stim_amp_ma_avg, stim_freq, stim_freq_max, stim_duration, stim_duration_max, stim_implantation_type, stim_electrode_make, stim_contact_separation, stim_contact_diameter, stim_contact_length, stim_phase_length, stim_phase_type, stim_epi_zone, stim_epi_zone_comments, effect_class, effect_descriptor, effect_details, effect_post_discharge, effect_lateralization, effect_dominant, effect_body_part, effect_comments, task_category, task_subcategory, task_characteristic, task_comments, function_category, function_subcategory, function_characteristic, function_article_designed_for_function, function_comments, occurrences, comments, comments_2, precision_score, clinical_semiology)
        Values (@source_id, @roi_side, @roi_lobe, @roi_region, @roi_area, @roi_from_figure, @roi_mni_x, @roi_mni_y, @roi_mni_z, @roi_mni_average, @stim_amp_ma_min, @stim_amp_ma_max, @stim_amp_ma_avg, @stim_freq, @stim_freq_max, @stim_duration, @stim_duration_max, @stim_implantation_type, @stim_electrode_make, @stim_contact_separation, @stim_contact_diameter, @stim_contact_length, @stim_phase_length, @stim_phase_type, @stim_epi_zone, @stim_epi_zone_comments, @effect_class, @effect_descriptor, @effect_details, @effect_post_discharge, @effect_lateralization, @effect_dominant, @effect_body_part, @effect_comments, @task_category, @task_subcategory, @task_characteristic, @task_comments, @function_category, @function_subcategory, @function_characteristic, @function_article_designed_for_function, @function_comments, @occurrences, @comments, @comments_2, @precision_score, @clinical_semiology)`
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
            stim_amp_ma_min: newResult.stimulation_parameters.amplitude_ma_min,
            stim_amp_ma_max: newResult.stimulation_parameters.amplitude_ma_max,
            stim_amp_ma_avg: newResult.stimulation_parameters.amplitude_ma_avg,
            stim_freq: newResult.stimulation_parameters.frequency_hz,
            stim_freq_max: newResult.stimulation_parameters.frequency_hz_max,
            stim_duration: newResult.stimulation_parameters.duration_s,
            stim_duration_max: newResult.stimulation_parameters.duration_s_max,
            stim_implantation_type: newResult.stimulation_parameters.implantation_type,
            stim_electrode_make: newResult.stimulation_parameters.electrode_make,
            stim_contact_separation: newResult.stimulation_parameters.contact_separation,
            stim_contact_diameter: newResult.stimulation_parameters.contact_diameter,
            stim_contact_length: newResult.stimulation_parameters.contact_length,
            stim_phase_length: newResult.stimulation_parameters.phase_length,
            stim_phase_type: newResult.stimulation_parameters.phase_type,
            stim_epi_zone: newResult.stimulation_parameters.epi_zone,
            stim_epi_zone_comments: newResult.stimulation_parameters.epi_zone_comments,
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
            precision_score: newResult.precision_score,
            clinical_semiology: newResult.clinical_semiology
        })
    }

    private _editResult(resultId: number, newResult: Result): void {
        console.debug("Editing result");

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
            stim_amp_ma_min=@stim_amp_ma_min,
            stim_amp_ma_max=@stim_amp_ma_max,
            stim_amp_ma_avg=@stim_amp_ma_avg,
            stim_freq=@stim_freq,
            stim_freq_max=@stim_freq_max,
            stim_duration=@stim_duration,
            stim_duration_max=@stim_duration_max,
            stim_implantation_type=@stim_implantation_type,
            stim_electrode_make=@stim_electrode_make,
            stim_contact_separation=@stim_contact_separation,
            stim_contact_diameter=@stim_contact_diameter,
            stim_contact_length=@stim_contact_length,
            stim_phase_length=@stim_phase_length,
            stim_phase_type=@stim_phase_type,
            stim_epi_zone=@stim_epi_zone,
            stim_epi_zone_comments=@stim_epi_zone_comments,
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
            precision_score=@precision_score,
            clinical_semiology=@clinical_semiology
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
            stim_amp_ma_min: newResult.stimulation_parameters.amplitude_ma_min,
            stim_amp_ma_max: newResult.stimulation_parameters.amplitude_ma_max,
            stim_amp_ma_avg: newResult.stimulation_parameters.amplitude_ma_avg,
            stim_freq: newResult.stimulation_parameters.frequency_hz,
            stim_freq_max: newResult.stimulation_parameters.frequency_hz_max,
            stim_duration: newResult.stimulation_parameters.duration_s,
            stim_duration_max: newResult.stimulation_parameters.duration_s_max,
            stim_implantation_type: newResult.stimulation_parameters.implantation_type,
            stim_electrode_make: newResult.stimulation_parameters.electrode_make,
            stim_contact_separation: newResult.stimulation_parameters.contact_separation,
            stim_contact_diameter: newResult.stimulation_parameters.contact_diameter,
            stim_contact_length: newResult.stimulation_parameters.contact_length,
            stim_phase_length: newResult.stimulation_parameters.phase_length,
            stim_phase_type: newResult.stimulation_parameters.phase_type,
            stim_epi_zone: newResult.stimulation_parameters.epi_zone,
            stim_epi_zone_comments: newResult.stimulation_parameters.epi_zone_comments,
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
            clinical_semiology: newResult.clinical_semiology
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
            rois.push({ level: 'lobe', lobe: lobe.name, region: null, area: null });
            for (let region of lobe.children) {
                rois.push({ level: 'region', lobe: lobe.name, region: region.name, area: null });
                for (let area of region.children) {
                    rois.push({ level: 'area', lobe: lobe.name, region: region.name, area: area.name });
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
            effects.push({ level: 'class', class: e_class.name, descriptor: null, details: null });
            for (let descriptor of e_class.children) {
                effects.push({ level: 'descriptor', class: e_class.name, descriptor: descriptor.name, details: null });
                for (let details of descriptor.children) {
                    effects.push({ level: 'details', class: e_class.name, descriptor: descriptor.name, details: details.name });
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
            tasks.push({ level: 'category', category: category.name, subcategory: null, characteristic: null });
            for (let subcategory of category.children) {
                tasks.push({ level: 'subcategory', category: category.name, subcategory: subcategory.name, characteristic: null });
                for (let characteristic of subcategory.children) {
                    tasks.push({ level: 'characteristic', category: category.name, subcategory: subcategory.name, characteristic: characteristic.name });
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
            functions.push({ level: 'category', category: category.name, subcategory: null, characteristic: null });
            for (let subcategory of category.children) {
                functions.push({ level: 'subcategory', category: category.name, subcategory: subcategory.name, characteristic: null });
                for (let characteristic of subcategory.children) {
                    functions.push({ level: 'characteristic', category: category.name, subcategory: subcategory.name, characteristic: characteristic.name });
                }
            }
        }
        return functions;
    }

    // Body Parts
    private readBodyPartsFromFile(): string[] {
        let file = path.join(app.getAppPath(), '../..', 'resources', 'base_body_parts.json');
        if (!fs.existsSync(file)) {
            file = path.join(app.getAppPath(), 'resources', 'base_body_parts.json');
        }
        const jsonstring = fs.readFileSync(file, 'utf-8');
        const base_body_parts = JSON.parse(jsonstring) as string[];
        return base_body_parts;
    }


    // Misc
    private createTablesIfNotExist() {
        console.debug('Creating tables...');
        this._createSourcesTableIfNotExist();
        this._createResultsTableIfNotExist();
    }

    private _createSourcesTableIfNotExist() {
        const createSourcesTableStmt = `
            CREATE TABLE IF NOT EXISTS Sources (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                author TEXT,
                date TEXT,
                publisher TEXT,
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
                stim_amp_ma_min REAL,
                stim_amp_ma_max REAL,
                stim_amp_ma_avg REAL,
                stim_freq INTEGER,
                stim_freq_max INTEGER,
                stim_duration INTEGER,
                stim_duration_max INTEGER,
                stim_implantation_type TEXT,
                stim_electrode_make TEXT,
                stim_contact_separation INTEGER,
                stim_contact_diameter INTEGER,
                stim_contact_length INTEGER,
                stim_phase_length REAL,
                stim_phase_type TEXT,
                stim_epi_zone TEXT,
                stim_epi_zone_comments TEXT,
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
                precision_score REAL,
                clinical_semiology TEXT
            );`;
        this.db.prepare(createStmt).run();
    }
}