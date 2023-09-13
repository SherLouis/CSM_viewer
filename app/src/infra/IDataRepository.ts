import { EffectArborescence } from "../core/models/EffectArborescence";
import { ROIArborescence } from "../core/models/ROIArborescence";
import { Result } from "../core/models/Result";
import { SourceSummary, Source } from "../core/models/Source";

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

    getROIArborescence(): ROIArborescence

    addManualROI(name: string, parentName: string) : void

    // Effect

    getEffectArborescence(): EffectArborescence

    addManualEffect(name: string, parentName: string) : void

    close(): void
}