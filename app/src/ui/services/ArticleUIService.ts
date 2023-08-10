import { ArticleSummaryDto } from "../../IPC/dtos/ArticlesSummaryDto";

export const getAllArticlesSummary = async () => {
    console.debug('Getting articles summary');
    // TODO: remove this delay. Only for testing purpose
    await new Promise(res => setTimeout(res, 5000));
    let response = await window.electronAPI.getArticlesSummary();
    console.debug(response);
    return response.map((dto) => toArticleSummaryDdo(dto));
}

const toArticleSummaryDdo = (dto: ArticleSummaryDto) => {
    return {
        doi: dto.doi,
        title: dto.title,
        nb_results: dto.nb_results
    } as ArticleSummaryDdo
}