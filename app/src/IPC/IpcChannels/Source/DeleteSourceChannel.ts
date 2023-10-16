import { IpcMainEvent } from "electron";
import { IpcChannelInterface } from "../../IpcChannelInterface";
import { IpcRequest } from "../../IpcRequest";
import { SourceService } from "../../../core/services/SourceService";
import { EditResponseDto } from "../../dtos/CreateEditResponseDto";

export class DeleteSourceChannel implements IpcChannelInterface {
  constructor(
    private service : SourceService
  ) {}

  getName(): string {
    return 'source:delete';
  }

  handle(_event: IpcMainEvent, request: DeleteSourceChannelRequest): EditResponseDto {
    console.log('Handling request on channel %s', this.getName())
    const success = this.service.deleteSource(request.params.sourceId);
    const response = {successful: success, message: success?"Successfully deleted source":"Failed to delete source"} as EditResponseDto;
    return response;
  }
}

class DeleteSourceChannelRequest implements IpcRequest {
  params: {
    sourceId: number
  }
}