import { ArticleSummary, Article } from "../core/models/Article";

export default interface IArticleRepository {
    getArticles(): ArticleSummary[]

    createArticle(newArticle: Article): void

    deleteArticle(articleId: string): void

    editArticle(articleId: string, newValue: Article): void

    close(): void
}