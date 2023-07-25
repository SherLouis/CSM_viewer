import { systemInfo } from "../../core/models/systemInfo";

export type systemInfoDto = {
    kernel: string;
}

export class systemInfoDtoMapper {
    public static toSystemInfoDto(model: systemInfo): systemInfoDto {
        return {kernel: model.kernel};
    }
}