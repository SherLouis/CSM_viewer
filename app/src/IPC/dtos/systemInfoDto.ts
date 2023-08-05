import { SystemInfo } from "../../core/models/systemInfo";

export type systemInfoDto = {
    kernel: string;
}

export class systemInfoDtoMapper {
    public static toSystemInfoDto(model: SystemInfo): systemInfoDto {
        return {kernel: model.kernel};
    }
}