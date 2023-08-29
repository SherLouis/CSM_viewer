import { IpcMainEvent } from "electron";
import { IpcChannelInterface } from "../../IpcChannelInterface";
import { IpcRequest } from "../../IpcRequest";
import { SourceService } from "../../../core/services/SourceService";
import { SourceDto, DtoFromModel } from "../../dtos/SourceDto";

export class GetSourceChannel implements IpcChannelInterface {
  constructor(
    private service : SourceService
  ) {}

  getName(): string {
    return 'source:get';
  }

  handle(_event: IpcMainEvent, request: GetSourceChannelRequest): SourceDto {
    console.log('Handling request on channel %s', this.getName())
    var source = this.service.getSource(request.params.sourceId);
    return DtoFromModel(source);
  }
}

class GetSourceChannelRequest implements IpcRequest {
  params: {
    sourceId: number
  }
}