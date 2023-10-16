import { IpcMainEvent } from "electron";
import { IpcChannelInterface } from "../../IpcChannelInterface";
import { IpcRequest } from "../../IpcRequest";
import { ROIDto, ROIDtoMapper } from "../../dtos/ROIDto";
import { ResultService } from "../../../core/services/ResultService";

export class GetROIsChannel implements IpcChannelInterface {
  constructor(
    private service : ResultService
  ) {}

  getName(): string {
    return 'results:getRois';
  }

  handle(_event: IpcMainEvent, request: IpcRequest): ROIDto[] {
    console.log('Handling request on channel %s', this.getName())
    var rois = this.service.getROIs();
    var roisDto = rois.map((roi) => ROIDtoMapper.ModelToDto(roi));
    return roisDto;
  }
}