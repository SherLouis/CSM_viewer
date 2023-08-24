import { Result } from "../../core/models/Result"
import { ResultDdo } from "../../ui/models/ResultDdo"

export type ResultDto = {
    id?: number,
    article_id: string,
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
    public static DdotoDto = (article_id: string, ddo: ResultDdo) : ResultDto=> {
        return {
            article_id: article_id,
            location: ddo.location,
            effect: ddo.effect,
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
        return dto as Result;
    }
}
