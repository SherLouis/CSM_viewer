import { Source } from "../../core/models/Source";

export type SourceEntity = {
    id: number,
    type: "article" | "experimental" | "other",
    author: string,
    date: string,
    publisher: string,
    location: string,
    doi: string,
    title: string,
    cohort: number,
    state: "À Faire" | "Fait" | "À Discutter"
}

export const SourceToEntity = (model: Source): SourceEntity => {
    return {
        id: model.id,
        type: model.type,
        author: model.author,
        date: model.date,
        publisher: model.publisher,
        location: model.location,
        doi: model.doi,
        title: model.title,
        cohort: model.cohort,
        state: model.state
    }
}

export const SourceEntityToModel = (entity: SourceEntity): Source => {
    return {
        id: entity.id,
        type: entity.type,
        author: entity.author,
        date: entity.date,
        publisher: entity.publisher,
        location: entity.location,
        doi: entity.doi,
        title: entity.title,
        cohort: entity.cohort,
        state: entity.state
    }
}