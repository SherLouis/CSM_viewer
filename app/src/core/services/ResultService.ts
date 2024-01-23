import IDataRepository from "../../infra/IDataRepository";
import { Effect } from "../models/Effect";
import { ROI } from "../models/ROI";
import { Result } from "../models/Result";
import { Task } from "../models/Task";
import { Function } from "../models/Function";


export class ResultService {
    dataRepository: IDataRepository;

    constructor(dataRepository: IDataRepository) { this.dataRepository = dataRepository }

    public getForSourceId(sourceId: number): Result[] {
        return this.dataRepository.getResults(sourceId);
    }

    public createResult(result: Result): boolean {
        try {
            this.dataRepository.createResult(result);
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }

    public editResult(result: Result): boolean {
        try {
            this.dataRepository.editResult(result.id, result);
            return true;
        }
        catch (e) {
            console.log(result);
            console.log(e);
            return false;
        }
    }

    public deleteResult(resultId: number): boolean {
        try {
            this.dataRepository.deleteResult(resultId);
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }

    public getROIs(): ROI[] {
        return this.dataRepository.getROIs();
    }

    public getEffects(): Effect[] {
        return this.dataRepository.getEffects();
    }

    public getTasks(): Task[] {
        return this.dataRepository.getTasks();
    }

    public getFunctions(): Function[] {
        return this.dataRepository.getFunctions();
    }
}