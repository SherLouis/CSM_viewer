import { ArticleSummary } from "../../core/models/Article";

export type ArticleSummaryDto = {
    doi: string,
    title: string,
    nb_results: number
}

export class ArticleSummaryDtoMapper {
    public static toDto(model: ArticleSummary): ArticleSummaryDto {
        return {
            doi: model.doi,
            title: model.title,
            nb_results: model.nb_results
        };
    }
}