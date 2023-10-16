import { IpcMainEvent } from "electron";
import { IpcChannelInterface } from "../../IpcChannelInterface";
import { IpcRequest } from "../../IpcRequest";
import { ResultDto, ResultsDtoMapper } from "../../dtos/ResultDto";
import { ResultService } from "../../../core/services/ResultService";

export class GetResultsChannel implements IpcChannelInterface {
  constructor(
    private service : ResultService
  ) {}

  getName(): string {
    return 'results:getForSource';
  }

  handle(_event: IpcMainEvent, request: GetResultsForSourceRequest): ResultDto[] {
    console.log('Handling request on channel %s', this.getName())
    var results = this.service.getForSourceId(request.params.sourceId);
    var resultsDtos = results.map((result) => ResultsDtoMapper.ModelToDto(result));
    return resultsDtos;
  }
}

class GetResultsForSourceRequest implements IpcRequest {
  params: {
    sourceId: number
  }
}