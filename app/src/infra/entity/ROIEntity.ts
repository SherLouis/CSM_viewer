import { ROI } from "../../core/models/ROI"


export type RoiEntity = {
    roi_description: string,
    roi_mask: string,
    count: number,
}

export const RoiEntityToRoiModel = (entity: RoiEntity): ROI => {
    return {
        description: entity.roi_description,
        mask: entity.roi_mask,
        count: entity.count,
    }
}