import { ResultsDtoMapper } from "../../IPC/dtos/ResultDto";
import { ROIDtoMapper } from "../../IPC/dtos/ROIDto";
import { EffectDtoMapper } from "../../IPC/dtos/EffectDto";
import { CreateResponseDto, EditResponseDto } from "../../IPC/dtos/CreateEditResponseDto";
import { ResultDdo } from "../models/ResultDdo";
import { ROIDdo } from "../models/ROIDdo";
import { EffectDdo } from "../models/EffectDdo";
import { TaskDdo } from "../models/TaskDdo";
import { TaskDtoMapper } from "../../IPC/dtos/TaskDto";
import { FunctionDdo } from "../models/FunctionDdo";
import { FunctionDtoMapper } from "../../IPC/dtos/FunctionDto";


let effectsCache: EffectDdo[] | null = null;
let effectsPromise: Promise<EffectDdo[]> | null = null;

let tasksCache: TaskDdo[] | null = null;
let tasksPromise: Promise<TaskDdo[]> | null = null;

let functionCache: FunctionDdo[] | null = null;
let functionPromise: Promise<FunctionDdo[]> | null = null;

let bodyPartsCache: string[] | null = null;
let bodyPartsPromise: Promise<string[]> | null = null;

export default class ResultUIService {
    public static getAllResultsForSource = async (sourceId: number): Promise<ResultDdo[]> => {
        console.debug(`Getting Results for source ${sourceId}`);
        let response = await window.electronAPI.getAllResultsForSource(sourceId);
        console.debug(response);
        return response.map((dto) => ResultsDtoMapper.DtoToDdo(dto));
    }

    public static editResult = async (sourceId: number, result: ResultDdo): Promise<EditResponseDto> => {
        console.debug(`Editing result ${result.id} with new value: `);
        console.debug(result);
        let response = await window.electronAPI.editResult(ResultsDtoMapper.DdotoDto(sourceId, result));
        return response;
    }

    public static deleteResult = async (resultId: number): Promise<EditResponseDto> => {
        console.debug(`Deleting result ${resultId}`);
        let response = await window.electronAPI.deleteResult(resultId);
        return response;
    }

    public static createResult = async (sourceId: number, result: ResultDdo): Promise<CreateResponseDto> => {
        console.debug('Creating result');
        let response = await window.electronAPI.createResult(ResultsDtoMapper.DdotoDto(sourceId, result));
        return response;
    }

    public static getROIs = async (): Promise<ROIDdo[]> => {
        console.debug('Getting ROIs');
        let response = await window.electronAPI.getROIs();
        return response.map((dto) => ROIDtoMapper.DtoToDdo(dto));
    }

    public static getEffects = async (): Promise<EffectDdo[]> => {
        if (effectsCache) {
            console.debug("Returning Effects from cache.");
            return effectsCache;
        }
        if (effectsPromise) { return effectsPromise; }

        effectsPromise = window.electronAPI.getEffects()
            .then((response) => {
                const effects = response.map(dto => EffectDtoMapper.DtoToDdo(dto));
                effectsCache = effects;
                effectsPromise = null;
                return effects;
            });
        return effectsPromise;
    }

    public static getTasks = async (): Promise<TaskDdo[]> => {

        if (tasksCache) {
            console.debug("Returning Tasks from cache.");
            return tasksCache;
        }
        if (tasksPromise) { return tasksPromise; }

        tasksPromise = window.electronAPI.getTasks()
            .then((response) => {
                const tasks = response.map(dto => TaskDtoMapper.DtoToDdo(dto));
                tasksCache = tasks;
                tasksPromise = null;
                return tasks;
            });
        return tasksPromise;
    }

    public static getFunctions = async (): Promise<FunctionDdo[]> => {
        if (functionCache) {
            console.debug("Returning Functions from cache.");
            return functionCache;
        }
        if (functionPromise) { return functionPromise; }

        functionPromise = window.electronAPI.getFunctions()
            .then((response) => {
                const functions = response.map(dto => FunctionDtoMapper.DtoToDdo(dto));
                functionCache = functions;
                functionPromise = null;
                return functions;
            });
        return functionPromise;
    }

    public static getBodyParts = async (): Promise<string[]> => {
        if (bodyPartsCache) {
            console.debug("Returning Body Parts from cache.");
            return bodyPartsCache;
        }
        if (bodyPartsPromise) { return bodyPartsPromise; }

        bodyPartsPromise = window.electronAPI.getEffects()
            .then((bodyParts) => {
                bodyPartsCache = bodyParts;
                bodyPartsPromise = null;
                return bodyParts;
            });
        return bodyPartsPromise;
    }
}