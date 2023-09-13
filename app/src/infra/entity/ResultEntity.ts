import { Result } from "../../core/models/Result"

// TODO: new model
export type ResultEntity = {
    id: number,
    source_id: number,
    location_side: string,
    location_lobe: string,
    location_gyrus: string,
    location_broadmann: string,
    effect_category: string,
    effect_semiology: string,
    effect_characteristic: string,
    effect_post_discharge: number,
    comments: string
}

export const ResultToEntity = (model: Result): ResultEntity => {
    return {
        id: model.id,
        source_id: model.source_id,
        location_side: model.location.side,
        location_lobe: model.location.lobe,
        location_gyrus: model.location.gyrus,
        location_broadmann: model.location.broadmann.join(','),
        effect_category: model.effect.category,
        effect_semiology: model.effect.semiology,
        effect_characteristic: model.effect.characteristic,
        effect_post_discharge: model.effect.post_discharge ? 1 : 0,
        comments: model.comments,
    }
}

export const ResultEntityToModel = (entity: ResultEntity): Result => {
    return {
        id: entity.id,
        source_id: entity.source_id,
        location: {
            side: entity.location_side,
            lobe: entity.location_lobe,
            gyrus: entity.location_gyrus,
            broadmann: entity.location_broadmann.split(','),
        },
        effect: {
            category: entity.effect_category,
            semiology: entity.effect_semiology,
            characteristic: entity.effect_characteristic,
            post_discharge: entity.effect_post_discharge == 1,
        },
        comments: entity.comments,
    }
}