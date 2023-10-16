import { IpcMainEvent } from "electron";
import { IpcChannelInterface } from "../../IpcChannelInterface";
import { IpcRequest } from "../../IpcRequest";
import {SourceSummaryDto, SourceSummaryDtoMapper} from "../../dtos/SourcesSummaryDto";
import { SourceService } from "../../../core/services/SourceService";

export class GetSourcesChannel implements IpcChannelInterface {
  constructor(
    private service : SourceService
  ) {}

  getName(): string {
    return 'source:getAll';
  }

  handle(_event: IpcMainEvent, _request: IpcRequest): SourceSummaryDto[] {
    console.log('Handling request on channel %s', this.getName())
    var sources = this.service.getAllSummary();
    var sourcesDto = sources.map((source) => SourceSummaryDtoMapper.toDto(source));
    return sourcesDto;
  }
}