import { CreateResponseDto, EditResponseDto } from "../../IPC/dtos/CreateEditResponseDto";
import { ArticleDto, ArticleDtoFromDdo } from "../../IPC/dtos/ArticleDto";
import { ArticleSummaryDto } from "../../IPC/dtos/ArticlesSummaryDto";

export default class ArticleUIService {
    public static getAllArticlesSummary = async () => {
        console.debug('Getting articles summary');
        let response = await window.electronAPI.getArticlesSummary();
        return response.map((dto) => this.toArticleSummaryDdo(dto));
    }

    public static getArticle = async (articleId: string) : Promise<ArticleDdo> => {
        console.debug(`Getting article ${articleId}`);
        let response = await window.electronAPI.getArticle(articleId);
        return this.ArticleDtoToArticleDdo(response);
    }

    public static editArticle =async (articleId:string, newArticle:ArticleDto) : Promise<EditResponseDto> => {
        console.debug(`Editing article ${articleId}`);
        let response = await window.electronAPI.editArticle(articleId, newArticle);
        return response;
    }

    public static deleteArticle = async(articleId: string) : Promise<EditResponseDto> => {
        console.debug(`Deleting article ${articleId}`);
        let response = await window.electronAPI.deleteArticle(articleId);
        return response;
    }

    private static ArticleDtoToArticleDdo = (dto: ArticleDto) => {
        return dto as ArticleDdo;
    }

    private static toArticleSummaryDdo = (dto: ArticleSummaryDto) => {
        return {
            doi: dto.doi,
            title: dto.title,
            nb_results: dto.nb_results
        } as ArticleSummaryDdo
    }

    public static createArticle = async (article: ArticleDdo) : Promise<CreateResponseDto> => {
        console.debug('Creating article');
        let response = await window.electronAPI.createArticle(ArticleDtoFromDdo(article));
        return response;
    }
}