import { Result } from "../../core/models/Result"
import { ResultDdo } from "../../ui/models/ResultDdo"

export type ResultDto = {
    id?: number,
    source_id: number,
    roi: {
        lobe: string,
        gyrus: string,
        sub: string,
        precision: string
    }
    stimulation_parameters: {
        amplitude_ma: number,
        frequency_hz: number,
        electrode_separation_mm: number,
        duration_s: number
    }
    effect: {
        category: string,
        semiology: string,
        characteristic: string,
        precision: string,
        post_discharge: boolean
    }
    occurrences: number,
    comments?: string
}

export class ResultsDtoMapper {
    public static DdotoDto = (source_id: number, ddo: ResultDdo): ResultDto => {
        return {
            id: ddo.id,
            source_id: source_id,
            roi: ddo.roi,
            stimulation_parameters: ddo.stimulation_parameters,
            effect: ddo.effect,
            occurrences: ddo.occurrences,
            comments: ddo.comments
        };
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
                lobe: dto.roi.lobe != '' ? dto.roi.lobe : null,
                gyrus: dto.roi.gyrus != '' ? dto.roi.gyrus : null,
                sub: dto.roi.sub != '' ? dto.roi.sub : null,
                precision: dto.roi.precision != '' ? dto.roi.precision : null,
            },
            effect: {
                category: dto.effect.category != '' ? dto.effect.category : null,
                semiology: dto.effect.semiology != '' ? dto.effect.semiology : null,
                characteristic: dto.effect.characteristic != '' ? dto.effect.characteristic : null,
                precision: dto.effect.precision != '' ? dto.effect.precision : null,
            }
        } as Result;
    }
}
