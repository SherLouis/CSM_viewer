// import { ResultsDtoMapper } from "../../IPC/dtos/ResultDto";
// import { ROIDtoMapper } from "../../IPC/dtos/ROIDto";
// import { EffectDtoMapper } from "../../IPC/dtos/EffectDto";
// import { CreateResponseDto, EditResponseDto } from "../../IPC/dtos/CreateEditResponseDto";
// import { ResultDdo } from "../models/ResultDdo";
// import { ROIDdo } from "../models/ROIDdo";
// import { EffectDdo } from "../models/EffectDdo";
// import { TaskDdo } from "../models/TaskDdo";
// import { TaskDtoMapper } from "../../IPC/dtos/TaskDto";
// import { FunctionDdo } from "../models/FunctionDdo";
// import { FunctionDtoMapper } from "../../IPC/dtos/FunctionDto";

export default class ResultUIService {}
//     public static getAllResultsForSource = async (sourceId: number): Promise<ResultDdo[]> => {
//         console.debug(`Getting Results for source ${sourceId}`);
//         let response = await window.electronAPI.getAllResultsForSource(sourceId);
//         return response.map((dto) => ResultsDtoMapper.DtoToDdo(dto));
//     }

//     public static editResult = async (sourceId:number, result: ResultDdo): Promise<EditResponseDto> => {
//         console.debug(`Editing result ${result.id} with new value: `);
//         let response = await window.electronAPI.editResult(ResultsDtoMapper.DdotoDto(sourceId, result));
//         return response;
//     }

//     public static deleteResult = async (resultId: number): Promise<EditResponseDto> => {
//         console.debug(`Deleting result ${resultId}`);
//         let response = await window.electronAPI.deleteResult(resultId);
//         return response;
//     }

//     public static createResult = async (sourceId: number, result: ResultDdo): Promise<CreateResponseDto> => {
//         console.debug('Creating result');
//         console.debug(result)
//         let response = await window.electronAPI.createResult(ResultsDtoMapper.DdotoDto(sourceId, result));
//         return response;
//     }

//     public static getROIs = async () : Promise<ROIDdo[]> => {
//         console.debug('Getting ROIs');
//         let response = await window.electronAPI.getROIs();
//         return response.map((dto) => ROIDtoMapper.DtoToDdo(dto))
//     }

//     public static getEffects = async () : Promise<EffectDdo[]> => {
//         console.debug('Getting ROIs');
//         let response = await window.electronAPI.getEffects();
//         return response.map((dto) => EffectDtoMapper.DtoToDdo(dto))
//     }

//     public static getTasks = async () : Promise<TaskDdo[]> => {
//         console.debug('Getting Tasks');
//         let response = await window.electronAPI.getTasks();
//         return response.map((dto) => TaskDtoMapper.DtoToDdo(dto))
//     }

//     public static getFunctions = async () : Promise<FunctionDdo[]> => {
//         console.debug('Getting Functions');
//         let response = await window.electronAPI.getFunctions();
//         return response.map((dto) => FunctionDtoMapper.DtoToDdo(dto))
//     }
// }