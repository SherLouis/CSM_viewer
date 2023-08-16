import { ArticleSummary } from "../../core/models/Article";

export type ArticleSummaryEntity = {
    doi: string,
    title: string,
    nb_results: number
}

export const ArticleSummaryEntityToModel = (entity: ArticleSummaryEntity) : ArticleSummary => {
    return {
        doi: entity.doi,
        title: entity.title,
        nb_results: entity.nb_results
    }
}