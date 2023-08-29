import { IpcMainEvent } from "electron";
import { IpcChannelInterface } from "../../IpcChannelInterface";
import { IpcRequest } from "../../IpcRequest";
import { SourceService } from "../../../core/services/SourceService";
import { SourceDto, ModelFromDto} from "../../dtos/SourceDto";
import { EditResponseDto } from "../../dtos/CreateEditResponseDto";

export class EditSourceChannel implements IpcChannelInterface {
  constructor(
    private service : SourceService
  ) {}

  getName(): string {
    return 'source:edit';
  }

  handle(_event: IpcMainEvent, request: EditSourceRequest): EditResponseDto {
    console.log('Handling request on channel %s', this.getName());
    const success = this.service.editSource(request.params.sourceId, ModelFromDto(request.params.dto));
    const response = {successful: success, message: success?"Successfully edited source":"Failed to edit source"} as EditResponseDto;
    return response;
  }
}

class EditSourceRequest implements IpcRequest {
    params: {
      sourceId: number
      dto: SourceDto
    }
  }