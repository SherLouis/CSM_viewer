import { Function } from "../../core/models/Function"

export type FunctionEntity = {
    id: number
    level: string,
    category: string,
    subcategory: string,
    characteristic: string,
    is_manual: number
}

export const FunctionEntityToModel = (entity: FunctionEntity): Function => {
    return {
        level: entity.level,
        category: entity.category,
        subcategory: entity.subcategory,
        characteristic: entity.characteristic,
        is_manual: entity.is_manual > 0,
    } as Function
}