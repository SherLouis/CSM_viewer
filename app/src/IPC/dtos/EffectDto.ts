import { Effect } from "../../core/models/Effect";

export type EffectDto = {
    level: string,
    category: string,
    semiology: string,
    characteristic: string,
    precision: string,
    is_manual: boolean
}

export class EffectDtoMapper {
    public static ModelToDto = (model: Effect) => {
        return model as EffectDto;
    }

    public static DtoToDdo = (dto: EffectDto) => {
        return dto as Effect;
    }
}