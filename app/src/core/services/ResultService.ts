import IDataRepository from "../../infra/IDataRepository";
import { Result } from "../models/Result";


export class ResultService {
    dataRepository: IDataRepository;

    constructor(dataRepository: IDataRepository) { this.dataRepository = dataRepository }

    public getForArticleId(articleId: string): Result[] {
        return this.dataRepository.getResults(articleId);
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

    public editResult(resultId: string, result: Result): boolean {
        try {
            this.dataRepository.editResult(resultId, result);
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }

    public deleteResult(resultId: string): boolean {
        try {
            this.dataRepository.deleteResult(resultId);
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }
}