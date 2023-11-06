import { SourceSummary } from "../../core/models/Source";

export type SourceSummaryEntity = {
    id: number,
    title: string,
    nb_results: number,
    state: "À Faire" | "Fait" | "À Discutter"
}

export const SourceSummaryEntityToModel = (entity: SourceSummaryEntity) : SourceSummary => {
    return {
        id: entity.id,
        title: entity.title,
        nb_results: entity.nb_results,
        state: entity.state
    }
}