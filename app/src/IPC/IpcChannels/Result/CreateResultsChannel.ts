import { IpcMainEvent } from "electron";
import { IpcChannelInterface } from "../../IpcChannelInterface";
import { IpcRequest } from "../../IpcRequest";
import { ResultDto, ResultsDtoMapper } from "../../dtos/ResultDto";
import { ResultService } from "../../../core/services/ResultService";
import { CreateResponseDto } from "../../dtos/CreateEditResponseDto";

export class CreateResultsChannel implements IpcChannelInterface {
  constructor(
    private service : ResultService
  ) {}

  getName(): string {
    return 'results:create';
  }

  handle(_event: IpcMainEvent, request: CreateResultRequest): CreateResponseDto {
    console.log('Handling request on channel %s', this.getName());
    const success = this.service.createResult(ResultsDtoMapper.DtoToModel(request.params.dto))
    const response = {successful: success, message: success?"Successfully created result":"Failed to create result"} as CreateResponseDto
    return response;
  }
}

class CreateResultRequest implements IpcRequest {
  params: {
    dto: ResultDto
  }
}