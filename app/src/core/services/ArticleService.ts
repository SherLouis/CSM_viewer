import IArticleRepository from "../../infra/IArticleRepository";
import { ArticleSummary, Article } from "../models/Article";

export class ArticleService {
    articleRepository: IArticleRepository;

    constructor(articleRepository: IArticleRepository) { this.articleRepository = articleRepository }

    public getAllSummary(): ArticleSummary[] {
        return this.articleRepository.getArticles();
    }

    public createArticle(article: Article): boolean {
        console.log(article);
        try {
            this.articleRepository.createArticle(article);
            return true;
        }
        catch (e){
            console.log(e);
            return false;
        }
    }
}