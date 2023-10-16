import { Source } from "../../core/models/Source"

export type SourceDto = {
    id: number,
    type: "article" | "experimental" | "other",
    author: string,
    date: string,
    publisher: string,
    location: string,
    doi: string,
    title: string,
    cohort: number
}

export const SourceDtoFromDdo = (ddo: SourceDdo): SourceDto => { return ddo as SourceDto }

export const ModelFromDto = (dto: SourceDto) => { return dto as Source }

export const DtoFromModel = (model: Source) => { return model as SourceDto }