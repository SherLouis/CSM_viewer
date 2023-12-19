import { SourceSummary } from "../../core/models/Source";

export type SourceSummaryDto = {
    id: number,
    title: string,
    nb_results: number,
    state: "À Faire" | "Fait" | "À Discutter"
}

export class SourceSummaryDtoMapper {
    public static toDto(model: SourceSummary): SourceSummaryDto {
        return {
            id: model.id,
            title: model.title,
            nb_results: model.nb_results,
            state: model.state,
        };
    }
}