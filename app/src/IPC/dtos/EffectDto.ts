import { EffectDdo } from "../../ui/models/EffectDdo";
import { Effect } from "../../core/models/Effect";

export type EffectDto = {
    level: string,
    class: string,
    descriptor: string,
    details: string
}

export class EffectDtoMapper {
    public static ModelToDto = (model: Effect) => {
        return model as EffectDto;
    }

    public static DtoToDdo = (dto: EffectDto) => {
        return dto as EffectDdo;
    }
}