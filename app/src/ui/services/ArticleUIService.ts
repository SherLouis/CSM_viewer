import { ArticleDtoFromDdo } from "../../IPC/dtos/ArticleDto";
import { ArticleSummaryDto } from "../../IPC/dtos/ArticlesSummaryDto";

export default class ArticleUIService {
    public static getAllArticlesSummary = async () => {
        console.debug('Getting articles summary');
        // TODO: remove this delay. Only for testing purpose
        await new Promise(res => setTimeout(res, 5000));
        let response = await window.electronAPI.getArticlesSummary();
        return response.map((dto) => this.toArticleSummaryDdo(dto));
    }

    private static toArticleSummaryDdo = (dto: ArticleSummaryDto) => {
        return {
            doi: dto.doi,
            title: dto.title,
            nb_results: dto.nb_results
        } as ArticleSummaryDdo
    }

    public static createArticle = async (article: ArticleDdo) => {
        console.debug('Creating article');
        let response = await window.electronAPI.createArticle(ArticleDtoFromDdo(article));
        return response;
    }
}