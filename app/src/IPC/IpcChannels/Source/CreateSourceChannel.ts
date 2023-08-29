import { IpcMainEvent } from "electron";
import { IpcChannelInterface } from "../../IpcChannelInterface";
import { IpcRequest } from "../../IpcRequest";
import { SourceService } from "../../../core/services/SourceService";
import { SourceDto, ModelFromDto} from "../../dtos/SourceDto";
import { CreateResponseDto } from "../../dtos/CreateEditResponseDto";

export class CreateSourceChannel implements IpcChannelInterface {
  constructor(
    private service : SourceService
  ) {}

  getName(): string {
    return 'source:create';
  }

  handle(_event: IpcMainEvent, request: CreateSourceRequest): CreateResponseDto {
    console.log('Handling request on channel %s', this.getName())
    const success = this.service.createSource(ModelFromDto(request.params.dto))
    const response = {successful: success, message: success?"Successfully create source":"Failed to create source"} as CreateResponseDto
    return response;
  }
}

class CreateSourceRequest implements IpcRequest {
    params: {
      dto: SourceDto
    }
  }