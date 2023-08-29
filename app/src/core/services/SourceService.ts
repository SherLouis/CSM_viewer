import IDataRepository from "../../infra/IDataRepository";
import { SourceSummary, Source } from "../models/Source";

export class SourceService {
    dataRepository: IDataRepository;

    constructor(sourceRepository: IDataRepository) { this.dataRepository = sourceRepository }

    public getAllSummary(): SourceSummary[] {
        return this.dataRepository.getSources();
    }

    public createSource(source: Source): boolean {
        console.log(source);
        try {
            this.dataRepository.createSource(source);
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }

    public getSource(sourceId: number): Source {
        return this.dataRepository.getSource(sourceId);
    }

    public editSource(sourceId: number, source: Source): boolean {
        try {
            this.dataRepository.editSource(sourceId, source);
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }

    public deleteSource(sourceId: number): boolean {
        console.log(sourceId);
        try {
            this.dataRepository.deleteSource(sourceId);
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }
}