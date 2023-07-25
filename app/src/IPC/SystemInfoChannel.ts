import {IpcChannelInterface} from "./IpcChannelInterface";
import {IpcMainEvent} from 'electron';
import {IpcRequest} from "./IpcRequest";
import { systemInfoDtoMapper } from "./dtos/systemInfoDto";
import { getSystemInfo } from "../core/services/systemInfoService";

export class SystemInfoChannel implements IpcChannelInterface {
  getName(): string {
    return 'system-info';
  }

  handle(event: IpcMainEvent, request: IpcRequest): void {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}_response`;
    }
    var systemInfo = systemInfoDtoMapper.toSystemInfoDto(getSystemInfo())
    event.sender.send(request.responseChannel, systemInfo);
  }
}