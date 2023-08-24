import IDataRepository from "../../infra/IDataRepository";
import { ArticleSummary, Article } from "../models/Article";

export class ArticleService {
    dataRepository: IDataRepository;

    constructor(articleRepository: IDataRepository) { this.dataRepository = articleRepository }

    public getAllSummary(): ArticleSummary[] {
        return this.dataRepository.getArticles();
    }

    public createArticle(article: Article): boolean {
        console.log(article);
        try {
            this.dataRepository.createArticle(article);
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }

    public getArticle(articleId: string): Article {
        return this.dataRepository.getArticle(articleId);
    }

    public editArticle(articleId: string, article: Article): boolean {
        try {
            console.debug("editArticle service");
            console.debug(article);
            this.dataRepository.editArticle(articleId, article);
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }

    public deleteArticle(articleId: string): boolean {
        console.log(articleId);
        try {
            this.dataRepository.deleteArticle(articleId);
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }
}