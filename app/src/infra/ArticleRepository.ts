import { ArticleSummary, Article } from "../core/models/Article";
import IArticleRepository from "./IArticleRepository";
import { ArticleEntity, ArticleEntityToModel, ArticleToEntity } from "./entity/ArticleEntity";
import { ArticleSummaryEntity, ArticleSummaryEntityToModel } from "./entity/ArticleSummaryEntity";
import Database from "better-sqlite3";

export default class ArticleRepository implements IArticleRepository {
    private dbLocation: string;
    private db: Database.Database;

    constructor(dbLocation: string) {
        this.dbLocation = dbLocation;
        this.db = new Database(this.dbLocation);
        this.createTablesIfNotExist();
    }

    getArticle(articleId: string): Article {
        const entity = this._getArticle(articleId);
        return ArticleEntityToModel(entity);
    }

    getArticles(): ArticleSummary[] {
        /*const articles = [
            { doi: "1234", title: "Test1", nb_results: 1 },
            { doi: "5678", title: "Test2", nb_results: 1 }
        ] as ArticleSummaryEntity[];*/
        const articles = this._getAllArticlesSummary();
        return articles.map((a) => ArticleSummaryEntityToModel(a))
    }
    createArticle(newArticle: Article): void {
        this._insertNewArticle(ArticleToEntity(newArticle));
    }
    deleteArticle(articleId: string): void {
        this._deleteArticle(articleId);
    }
    editArticle(articleId: string, newValue: Article): void {
        this._editArticle(articleId, ArticleToEntity(newValue));
    }

    close(): void {
        this.db.close();
    }

    private _getArticle(articleId: string): ArticleEntity {
        const stmt = 'SELECT * FROM Articles WHERE doi = ?';
        const result = this.db.prepare(stmt).get(articleId) as ArticleEntity;
        console.debug(result);
        return result;
    }

    private _getAllArticlesSummary(): ArticleSummaryEntity[] {
        const stmt = `
        SELECT
            Articles.doi,
            Articles.title,
            COALESCE(ResultCounts.nb_results, 0) AS nb_results
        FROM
            Articles
        LEFT JOIN (
            SELECT
                article_doi,
                COUNT(*) AS nb_results
            FROM Results
            GROUP BY article_doi
        ) AS ResultCounts ON Articles.doi = ResultCounts.article_doi;`;
        const results = this.db.prepare(stmt).all() as ArticleSummaryEntity[];
        return results;
    }

    private _insertNewArticle(newArticle: ArticleEntity) {
        console.debug("Inserting new article: ");
        console.debug(newArticle);
        const insetStmt = 'INSERT INTO Articles (doi, title, stimulation_type, stimulation_electrode_separation, stimulation_polarity, stimulation_current_mA, stimulation_pulse_width_ms, stimulation_pulse_freq_Hz, stimulation_train_duration_s) VALUES (@doi, @title, @stimulation_type, @stimulation_electrode_separation, @stimulation_polarity, @stimulation_current_mA, @stimulation_pulse_width_ms, @stimulation_pulse_freq_Hz, @stimulation_train_duration_s)';
        this.db.prepare(insetStmt).run(newArticle);
    }

    private _editArticle(articleId: string, article: ArticleEntity) {
        console.debug(`Editing article ${articleId} with new value:`);
        console.debug(article);
        const stmt = `
        UPDATE Articles SET 
            doi=@doi,
            title=@title,
            stimulation_type=@stimulation_type,
            stimulation_electrode_separation=@stimulation_electrode_separation,
            stimulation_polarity=@stimulation_polarity,
            stimulation_current_mA=@stimulation_current_mA,
            stimulation_pulse_width_ms=@stimulation_pulse_width_ms,
            stimulation_pulse_freq_Hz=@stimulation_pulse_freq_Hz,
            stimulation_train_duration_s=@stimulation_train_duration_s
        WHERE doi=@articleDoiToEdit`
        const result = this.db.prepare(stmt).run({ ...article, articleDoiToEdit: articleId });
    }

    private _deleteArticle(articleId: string): void {
        const stmt = 'DELETE FROM Articles WHERE doi = ?';
        this.db.prepare(stmt).run(articleId);
    }

    private createTablesIfNotExist() {
        console.debug('Creating tables...');
        try {
            const createArticlesTableStmt = "CREATE TABLE IF NOT EXISTS Articles (doi TEXT NOT NULL PRIMARY KEY, title TEXT, stimulation_type TEXT, stimulation_electrode_separation INTEGER, stimulation_polarity TEXT, stimulation_current_mA INTEGER, stimulation_pulse_width_ms INTEGER, stimulation_pulse_freq_Hz INTEGER, stimulation_train_duration_s INTEGER);";
            // TODO: add other fields for Results table
            const createResultsTableStmt = "CREATE TABLE IF NOT EXISTS Results (id INTEGER PRIMARY KEY AUTOINCREMENT, article_doi TEXT NOT NULL);";
            this.db.prepare(createArticlesTableStmt).run();
            this.db.prepare(createResultsTableStmt).run();
        }
        catch (e) { console.log(e) }
    }
}