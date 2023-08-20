import { Result } from "../../core/models/Result"
import { ResultDdo } from "../../ui/models/ResultDdo"

export type ResultDto = {
    id: number,
    location: {
        side: "left" | "right",
        lobe: string,
        gyrus: string,
        broadmann: string[]
    },
    effect: {
        category: string,
        semiology: string,
        characteristic: string,
        post_discharge: boolean
    }
    comments?: string
}

export class ResultsDtoMapper {
    public static DdotoDto = (ddo: ResultDdo) => {
        return ddo as ResultDto;
    }
    
    public static DtoToDdo = (dto: ResultDto) => {
        return dto as ResultDdo;
    }

    public static ModelToDto = (model: Result) => {
        return model as ResultDto;
    }

    public static DtoToModel = (dto: Result) => {
        return dto as Result;
    }
}
