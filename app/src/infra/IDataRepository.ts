import { Effect } from "../core/models/Effect";
import { ROI } from "../core/models/ROI";
import { Result } from "../core/models/Result";
import { SourceSummary, Source } from "../core/models/Source";
import {Task} from "../core/models/Task";
import {Function} from "../core/models/Function";

export default interface IDataRepository {
    setDbLocation(dbLocation: string): boolean

    // Source

    getSource(sourceId: number): Source

    getSources(): SourceSummary[]

    createSource(newSource: Source): void

    deleteSource(sourceId: number): void

    editSource(sourceId: number, newValue: Source): void

    // Result

    getResults(sourceId: number): Result[]

    createResult(result: Result): void

    deleteResult(resultId: number): void

    editResult(resultId: number, newValue: Result): void

    // ROI
    getROIs(): ROI[]

    // Effect

    getEffects(): Effect[]

    // Tasks
    getTasks(): Task[]

    // Functions
    getFunctions(): Function[]

    close(): void
}