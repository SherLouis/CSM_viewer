import { ROIDdo } from "../../ui/models/ROIDdo";
import { ROI } from "../../core/models/ROI";

export type ROIDto = {
    level: string,
    lobe: string,
    gyrus: string,
    sub: string,
    precision: string,
    is_manual: boolean
}

export class ROIDtoMapper {
    public static ModelToDto = (model: ROI) => {
        return model as ROIDto;
    }

    public static DtoToDdo = (dto: ROIDto) => {
        return dto as ROIDdo;
    }
}