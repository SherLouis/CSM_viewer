import { ArticleSummary, Article } from "../core/models/Article";

export default interface IArticleRepository {
    getArticle(articleId: string): Article

    getArticles(): ArticleSummary[]

    createArticle(newArticle: Article): void

    deleteArticle(articleId: string): void

    editArticle(articleId: string, newValue: Article): void

    close(): void
}