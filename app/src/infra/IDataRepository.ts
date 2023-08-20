import { Result } from "../core/models/Result";
import { ArticleSummary, Article } from "../core/models/Article";

export default interface IDataRepository {
    getArticle(articleId: string): Article

    getArticles(): ArticleSummary[]

    createArticle(newArticle: Article): void

    deleteArticle(articleId: string): void

    editArticle(articleId: string, newValue: Article): void

    getResults(articleId: string): Result[]

    createResult(result: Result): void

    deleteResult(resultId: string): void

    editResult(resultId: string, newValue: Result): void

    close(): void
}