import { CreateResponseDto, EditResponseDto } from "../../IPC/dtos/CreateEditResponseDto";
import { SourceDto, SourceDtoFromDdo } from "../../IPC/dtos/SourceDto";
import { SourceSummaryDto } from "../../IPC/dtos/SourcesSummaryDto";
import { SourceDdo, SourceSummaryDdo } from "../models/SourceDdo";

export default class SourceUIService {
    public static getAllSourcesSummary = async () => {
        console.debug('Getting sources summary');
        let response = await window.electronAPI.getSourcesSummary();
        return response.map((dto) => this.toSourceSummaryDdo(dto));
    }

    public static getSource = async (sourceId: number) : Promise<SourceDdo> => {
        console.debug(`Getting source ${sourceId}`);
        let response = await window.electronAPI.getSource(sourceId);
        return this.SourceDtoToSourceDdo(response);
    }

    public static editSource =async (sourceId:number, newSource:SourceDto) : Promise<EditResponseDto> => {
        console.debug(`Editing source ${sourceId}`);
        let response = await window.electronAPI.editSource(sourceId, newSource);
        return response;
    }

    public static deleteSource = async(sourceId: number) : Promise<EditResponseDto> => {
        console.debug(`Deleting source ${sourceId}`);
        let response = await window.electronAPI.deleteSource(sourceId);
        return response;
    }

    private static SourceDtoToSourceDdo = (dto: SourceDto) => {
        return dto as SourceDdo;
    }

    private static toSourceSummaryDdo = (dto: SourceSummaryDto) => {
        return {
            id: dto.id,
            title: dto.title,
            nb_results: dto.nb_results,
            state: dto.state,
        } as SourceSummaryDdo
    }

    public static createSource = async (source: SourceDdo) : Promise<CreateResponseDto> => {
        console.debug('Creating source');
        let response = await window.electronAPI.createSource(SourceDtoFromDdo(source));
        return response;
    }
}