import { Result } from "../../core/models/Result"
import { ResultDdo } from "../../ui/models/ResultDdo"

export type ResultDto = {
    id?: number,
    source_id: number,
    roi: {
        side: string,
        lobe: string,
        gyrus: string,
        sub: string,
        precision: string
    },
    roi_destrieux: string[],
    stimulation_parameters: {
        amplitude_ma: number,
        amplitude_ma_max: number,
        frequency_hz: number,
        frequency_hz_max: number,
        duration_s: number,
        duration_s_max: number,
        electrode_make: string,
        implentation_type: string,
        contact_separation: number,
        contact_diameter: number,
        contact_length: number,
        phase_length: number,
        phase_type: string,
    }
    effect: {
        category: string,
        semiology: string,
        characteristic: string,
        post_discharge: boolean,
        lateralization: string,
        dominant: string,
        body_part: string,
        comments: string,
    },
    task: {
        category: string,
        subcategory: string,
        characteristic: string,
        comments: string,
    },
    function: {
        category: string,
        subcategory: string,
        characteristic: string,
        comments: string,
    },
    occurrences: number,
    comments?: string,
    comments_2?: string,
    precision_score: number,
}

export class ResultsDtoMapper {
    public static DdotoDto = (source_id: number, ddo: ResultDdo): ResultDto => {
        return {...ddo, source_id: source_id};
    }

    public static DtoToDdo = (dto: ResultDto) => {
        return dto as ResultDdo;
    }

    public static ModelToDto = (model: Result) => {
        return model as ResultDto;
    }

    public static DtoToModel = (dto: ResultDto) => {
        return {
            ...dto,
            roi: {
                side: dto.roi.side != '' ? dto.roi.side : null,
                lobe: dto.roi.lobe != '' ? dto.roi.lobe : null,
                gyrus: dto.roi.gyrus != '' ? dto.roi.gyrus : null,
                sub: dto.roi.sub != '' ? dto.roi.sub : null,
                precision: dto.roi.precision != '' ? dto.roi.precision : null
            },
            effect: {
                category: dto.effect.category != '' ? dto.effect.category : null,
                semiology: dto.effect.semiology != '' ? dto.effect.semiology : null,
                characteristic: dto.effect.characteristic != '' ? dto.effect.characteristic : null,
                lateralization: dto.effect.lateralization != '' ? dto.effect.lateralization : null,
                dominant: dto.effect.dominant != '' ? dto.effect.dominant : null,
                body_part: dto.effect.body_part != '' ? dto.effect.body_part : null,
                post_discharge: dto.effect.post_discharge === null ? false : dto.effect.post_discharge,
                comments: dto.effect.comments
            },
            task: {
                category: dto.task.category != '' ? dto.task.category : null,
                subcategory: dto.task.subcategory != '' ? dto.task.subcategory : null,
                characteristic: dto.task.characteristic != '' ? dto.task.characteristic : null,
                comments: dto.task.comments
            },
            function: {
                category: dto.function.category != '' ? dto.function.category : null,
                subcategory: dto.function.subcategory != '' ? dto.function.subcategory : null,
                characteristic: dto.function.characteristic != '' ? dto.function.characteristic : null,
                comments: dto.function.comments
            }
        } as Result
    }
}
