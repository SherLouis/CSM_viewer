import { ResultsDtoMapper } from "../../IPC/dtos/ResultDto";
import { CreateResponseDto, EditResponseDto } from "../../IPC/dtos/CreateEditResponseDto";
import { ResultDdo } from "../models/ResultDdo";

export default class ResultUIService {
    public static getAllResultsForArticle = async (articleId: string): Promise<ResultDdo[]> => {
        console.debug(`Getting Results for article ${articleId}`);
        let response = await window.electronAPI.getAllResultsForArticle(articleId);
        return response.map((dto) => ResultsDtoMapper.DtoToDdo(dto));
    }

    public static editResult = async (newValue: ResultDdo): Promise<EditResponseDto> => {
        console.debug(`Editing result ${newValue.id}`);
        throw new Error("Not yet implemented");
    }

    public static deleteResult = async (resultId: string): Promise<EditResponseDto> => {
        console.debug(`Deleting result ${resultId}`);
        throw new Error("Not yet implemented");
    }

    public static createResult = async (articleId: string, result: ResultDdo): Promise<CreateResponseDto> => {
        console.debug('Creating result');
        let response = await window.electronAPI.createResult(ResultsDtoMapper.DdotoDto(articleId, result));
        return response;
    }
}