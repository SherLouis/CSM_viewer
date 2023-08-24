import { IpcMainEvent } from "electron";
import { IpcChannelInterface } from "../../IpcChannelInterface";
import { IpcRequest } from "../../IpcRequest";
import { ResultService } from "../../../core/services/ResultService";
import { EditResponseDto } from "../../dtos/CreateEditResponseDto";
import { ResultDto, ResultsDtoMapper } from "../../dtos/ResultDto";

export class EditResultChannel implements IpcChannelInterface {
  constructor(
    private service : ResultService
  ) {}

  getName(): string {
    return 'result:edit';
  }

  handle(_event: IpcMainEvent, request: EditResultRequest): EditResponseDto {
    console.log('Handling request on channel %s', this.getName());
    console.debug(request.params.dto);
    console.debug(request.params.resultId);
    const success = this.service.editResult(request.params.resultId, ResultsDtoMapper.DtoToModel(request.params.dto));
    const response = {successful: success, message: success?"Successfully edited result":"Failed to edit result"} as EditResponseDto;
    return response;
  }
}

class EditResultRequest implements IpcRequest {
    params: {
      resultId: number
      dto: ResultDto
    }
  }