import { ROIDdo } from "../../ui/models/ROIDdo";
import { ROI } from "../../core/models/ROI";

export type ROIDto = {
    description: string,
    mask: string,
    count: number,
}

export class ROIDtoMapper {
    public static ModelToDto = (model: ROI) => {
        return model as ROIDto;
    }

    public static DtoToDdo = (dto: ROIDto) => {
        return dto as ROIDdo;
    }
}