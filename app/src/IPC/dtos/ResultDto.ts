import { Result } from "../../core/models/Result"
import { ResultDdo } from "../../ui/models/ResultDdo"

export type ResultDto = {
    id?: number,
    source_id: number,
    roi: {
        side: string,
        description: string,
        mask: string,
        mask_conversion_method: string,
    },
    stimulation_parameters: {
        stated: boolean,
        amplitude_ma_min: number,
        amplitude_ma_max: number,
        amplitude_ma_avg: number,
        frequency_hz: number,
        frequency_hz_max: number,
        duration_s: number,
        duration_s_max: number,
        electrode_make: string,
        implantation_type: string,
        contact_separation: number,
        contact_diameter: number,
        contact_length: number,
        phase_length: number,
        phase_type: string,
        epi_zone: string,
        epi_zone_comments: string,
    }
    effect: {
        class: string,
        descriptor: string,
        details: string,
        post_discharge: string,
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
        article_designed_for_function: boolean,
        comments: string,
    },
    occurrences: number,
    comments?: string,
    comments_2?: string,
    precision_score: number,
    source_db?: string,
    clinical_semiology: string,
}

export class ResultsDtoMapper {
    public static DdotoDto = (source_id: number, ddo: ResultDdo): ResultDto => {
        return { ...ddo, source_id: source_id };
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
                side: dto.roi.side,
                description: dto.roi.description,
                mask: dto.roi.mask,
                mask_conversion_method: dto.roi.mask_conversion_method,
            },
            effect: {
                class: dto.effect.class,
                descriptor: dto.effect.descriptor,
                details: dto.effect.details,
                lateralization: dto.effect.lateralization,
                dominant: dto.effect.dominant,
                body_part: dto.effect.body_part,
                post_discharge: dto.effect.post_discharge,
                comments: dto.effect.comments
            },
            task: {
                category: dto.task.category,
                subcategory: dto.task.subcategory,
                characteristic: dto.task.characteristic,
                comments: dto.task.comments
            },
            function: {
                category: dto.function.category,
                subcategory: dto.function.subcategory,
                characteristic: dto.function.characteristic,
                article_designed_for_function: dto.function.article_designed_for_function,
                comments: dto.function.comments
            }
        } as Result
    }
}
