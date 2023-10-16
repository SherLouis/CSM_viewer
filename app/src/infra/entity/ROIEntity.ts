import { ROI } from "../../core/models/ROI"

export type ROIEntity = {
    id: number,
    level: string,
    lobe: string,
    gyrus: string,
    sub: string,
    precision: string,
    parent_id: number,
    is_manual: number
}

export const ROIEntityToModel = (entity: ROIEntity): ROI => {
    return {
        level: entity.level,
        lobe: entity.lobe,
        gyrus: entity.gyrus,
        sub: entity.sub,
        precision: entity.precision,
        is_manual: entity.is_manual > 0,
    } as ROI
}