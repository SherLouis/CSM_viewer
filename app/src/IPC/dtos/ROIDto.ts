import { ROIDdo } from "../../ui/models/ROIDdo";
import { ROI } from "../../core/models/ROI";

export type ROIDto = {
    level: string,
    lobe: string,
    region: string,
    area: string
}

export class ROIDtoMapper {
    public static ModelToDto = (model: ROI) => {
        return model as ROIDto;
    }

    public static DtoToDdo = (dto: ROIDto) => {
        return dto as ROIDdo;
    }
}