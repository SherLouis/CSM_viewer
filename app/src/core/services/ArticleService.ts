import { ArticleSummary, Article} from "../models/Article";

export class ArticleService {
    public getAllSummary(): ArticleSummary[] {
        // TODO
        return [
            { doi: "1234", title: "Test1", nb_results: 1 },
            { doi: "5678", title: "Test2", nb_results: 1 }
        ];
    }

    public createArticle(article: Article): boolean {
        // TODO
        return false;
    }
}