import { Result } from "../core/models/Result";
import { SourceSummary, Source } from "../core/models/Source";

export default interface IDataRepository {
    setDbLocation(dbLocation: string): boolean

    getSource(sourceId: number): Source

    getSources(): SourceSummary[]

    createSource(newSource: Source): void

    deleteSource(sourceId: number): void

    editSource(sourceId: number, newValue: Source): void

    getResults(sourceId: number): Result[]

    createResult(result: Result): void

    deleteResult(resultId: number): void

    editResult(resultId: number, newValue: Result): void

    close(): void
}