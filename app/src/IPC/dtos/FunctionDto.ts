import { FunctionDdo } from "../../ui/models/FunctionDdo";
import { Function } from "../../core/models/Function";

export type FunctionDto = {
    level: string,
    category: string,
    subcategory: string,
    characteristic: string,
    is_manual: boolean
}

export class FunctionDtoMapper {
    public static ModelToDto = (model: Function) => {
        return model as FunctionDto;
    }

    public static DtoToDdo = (dto: FunctionDto) => {
        return dto as FunctionDdo;
    }
}