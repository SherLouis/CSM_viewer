import { Effect } from "../../core/models/Effect"

export type EffectEntity = {
    id: number
    level: string,
    category: string,
    semiology: string,
    characteristic: string,
    is_manual: number
}

export const EffectEntityToModel = (entity: EffectEntity): Effect => {
    return {
        level: entity.level,
        category: entity.category,
        semiology: entity.semiology,
        characteristic: entity.characteristic,
        is_manual: entity.is_manual > 0,
    } as Effect
}