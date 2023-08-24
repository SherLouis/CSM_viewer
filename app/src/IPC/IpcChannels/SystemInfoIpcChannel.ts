import { IpcMainEvent } from "electron";
import { IpcChannelInterface } from "../IpcChannelInterface";
import { IpcRequest } from "../IpcRequest";
import { systemInfoDto, systemInfoDtoMapper } from "../dtos/systemInfoDto";
import { SystemInfoService } from "../../core/services/systemInfoService";

export class SystemInfoChannel implements IpcChannelInterface {
  constructor(
    private systemInfoService : SystemInfoService
  ) {}

  getName(): string {
    return 'system:getInfo';
  }

  handle(event: IpcMainEvent, request: GetSystemInfoRequest): systemInfoDto {
    console.log('Handling request on channel %s with param param1 =', this.getName(), request.params.param1)
    var systemInfo = this.systemInfoService.getSystemInfo();
    var systemInfoDto = systemInfoDtoMapper.toSystemInfoDto(systemInfo)
    return systemInfoDto;
  }
}

class GetSystemInfoRequest implements IpcRequest {
  params: {
    param1: string
  }
}