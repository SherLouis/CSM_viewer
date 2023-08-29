import { ResultsDtoMapper } from "../../IPC/dtos/ResultDto";
import { CreateResponseDto, EditResponseDto } from "../../IPC/dtos/CreateEditResponseDto";
import { ResultDdo } from "../models/ResultDdo";

export default class ResultUIService {
    public static getAllResultsForSource = async (sourceId: number): Promise<ResultDdo[]> => {
        console.debug(`Getting Results for source ${sourceId}`);
        let response = await window.electronAPI.getAllResultsForSource(sourceId);
        return response.map((dto) => ResultsDtoMapper.DtoToDdo(dto));
    }

    public static editResult = async (resultId:number, newValue: ResultDdo): Promise<EditResponseDto> => {
        console.debug(`Editing result ${resultId} with new value: `);
        console.debug(newValue);
        let response = await window.electronAPI.editResult(resultId, newValue);
        return response;
    }

    public static deleteResult = async (resultId: number): Promise<EditResponseDto> => {
        console.debug(`Deleting result ${resultId}`);
        let response = await window.electronAPI.deleteResult(resultId);
        return response;
    }

    public static createResult = async (sourceId: number, result: ResultDdo): Promise<CreateResponseDto> => {
        console.debug('Creating result');
        console.debug(result)
        let response = await window.electronAPI.createResult(ResultsDtoMapper.DdotoDto(sourceId, result));
        return response;
    }
}