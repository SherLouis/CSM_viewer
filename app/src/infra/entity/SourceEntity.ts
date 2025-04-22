import { Source } from "../../core/models/Source";

export type SourceEntity = {
    id: number,
    author: string,
    date: string,
    publisher: string,
    doi: string,
    title: string,
    cohort: number,
    state: "À Faire" | "Fait" | "À Discutter"
}

export const SourceToEntity = (model: Source): SourceEntity => {
    return {
        id: model.id,
        author: model.author,
        date: model.date,
        publisher: model.publisher,
        doi: model.doi,
        title: model.title,
        cohort: model.cohort,
        state: model.state
    }
}

export const SourceEntityToModel = (entity: SourceEntity): Source => {
    return {
        id: entity.id,
        author: entity.author,
        date: entity.date,
        publisher: entity.publisher,
        doi: entity.doi,
        title: entity.title,
        cohort: entity.cohort,
        state: entity.state
    }
}