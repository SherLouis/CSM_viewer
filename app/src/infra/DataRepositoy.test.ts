import Database from "better-sqlite3";
import DataRepository from "./DataRepository";
import { Source } from "../core/models/Source";
import { Result } from "../core/models/Result";

const db_location = './testdb.sqlite';
const repository = new DataRepository(db_location);
const db = new Database(db_location);

/*
describe('Given Source in DB', () => {
    beforeAll(() => {
        deleteAllRecords();
        insertSource();
    })

    describe('when get source by id', () => {
        it('Returns source model', () => {
            const source = repository.getSource(1);
            expect(source).toEqual({
                id: 1,
                type: 'article',
                author: 'me',
                date: '2023-01-01',
                publisher: null,
                location: null,
                doi: null,
                title: 'test'
            } as Source)
        })
    })

    describe('when result with effect and roi', () => {
        beforeAll(() => {
            insertROI();
            insertEffect();
            insertResult();
        })
        it('returns result', () => {
            const results = repository.getResults(1);
            expect(results.length).toBe(1);
            expect(results[0]).toEqual({
                id: 1,
                source_id: 1,
                roi: {
                    lobe: 'frontal',
                    gyrus: 'gyrus',
                    sub: 'sub',
                    precision: null
                },
                effect: {
                    category: 'category1',
                    semiology: 'semiology1',
                    characteristic: 'characteristic1',
                    precision: null,
                    post_discharge: false
                },
                stimulation_parameters: {
                    amplitude_ma: 5,
                    duration_s: 2,
                    contact_separation_mm: 2,
                    frequency_hz: 5
                },
                occurrences: 3,
                comments: null
            } as Result)
        })
    })
})
*/

const deleteAllRecords = () => {
    db.prepare('DELETE FROM Sources;').run();
    db.prepare('DELETE FROM Results;').run();
    db.prepare('DELETE FROM Effects;').run();
    db.prepare('DELETE FROM ROIs;').run();
}

const insertSource = () => {
    db.prepare(`INSERT INTO Sources (id,type,author,date,publisher,location,doi, title) 
                            VALUES (@id,@type,@author,@date,@publisher,@location,@doi, @title)`)
        .run({ id: 1, type: 'article', author: 'me', date: '2023-01-01', publisher: null, location: null, doi: null, title: 'test' });
}

const insertROI = () => {
    db.prepare(`INSERT INTO ROIs (id,level,lobe,gyrus,sub,precision,parent_id,is_manual)
                VALUES (@id,@level,@lobe,@gyrus,@sub,@precision,@parent_id,@is_manual)`)
        .run({ id: 1, level: 'gyrus', lobe: 'frontal', gyrus: 'gyrus', sub: 'sub', precision: null, parent_id: null, is_manual: 0 });
}

const insertEffect = () => {
    db.prepare(`INSERT INTO Effects (id,level,category,semiology,characteristic,precision,parent_id,is_manual)
        VALUES (@id,@level,@category,@semiology,@characteristic,@precision,@parent_id,@is_manual)`)
        .run({ id: 1, level: 'semiology', category: 'category1', semiology: 'semiology1', characteristic: 'characteristic1', precision: null, parent_id: null, is_manual: 0 });
}

const insertResult = () => {
    db.prepare(`INSERT INTO Results (id,source_id,roi_id,stim_amp_ma,stim_freq,stim_contact_separation,stim_duration_ms,effect_id,effect_post_discharge,occurrences,comments)
                    VALUES (@id,@source_id,@roi_id,@stim_amp_ma,@stim_freq,@stim_contact_separation,@stim_duration_ms,@effect_id,@effect_post_discharge,@occurrences,@comments)`)
        .run({ id: 1, source_id: 1, roi_id: 1, stim_amp_ma: 5, stim_freq: 5, stim_contact_separation: 2, stim_duration_ms: 2, effect_id: 1, effect_post_discharge: 0, occurrences: 3, comments: null })
}