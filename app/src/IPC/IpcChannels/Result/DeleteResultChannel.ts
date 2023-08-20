import { IpcMainEvent } from "electron";
import { IpcChannelInterface } from "../../IpcChannelInterface";
import { IpcRequest } from "../../IpcRequest";
import { ResultService } from "../../../core/services/ResultService";
import { EditResponseDto } from "../../../IPC/dtos/CreateEditResponseDto";

export class DeleteResultChannel implements IpcChannelInterface {
  constructor(
    private service : ResultService
  ) {}

  getName(): string {
    return 'result:delete';
  }

  handle(_event: IpcMainEvent, request: DeleteResultChannelRequest): EditResponseDto {
    console.log('Handling request on channel %s', this.getName())
    const success = this.service.deleteResult(request.params.resultId);
    const response = {successful: success, message: success?"Successfully deleted result":"Failed to delete result"} as EditResponseDto;
    return response;
  }
}

class DeleteResultChannelRequest implements IpcRequest {
  params: {
    resultId: number
  }
}