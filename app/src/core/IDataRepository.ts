import { Effect } from "./models/Effect";
import { ROI } from "./models/ROI";
import { Result } from "./models/Result";
import { SourceSummary, Source } from "./models/Source";
import {Task} from "./models/Task";
import {Function} from "./models/Function";

export default interface IDataRepository {
    setDbLocation(dbLocation: string): boolean

    migrateDb(newDbLocation: string): boolean

    mergeWith(mergeWithDbLocation: string, saveResultInDbLocation: string): boolean

    exportToCsv(exportCsvFilePath: string): Promise<void>

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

    // Body Parts
    getBodyParts(): String[]

    close(): void
}