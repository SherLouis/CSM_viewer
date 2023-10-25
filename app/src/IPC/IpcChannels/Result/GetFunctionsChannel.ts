import { IpcMainEvent } from "electron";
import { IpcChannelInterface } from "../../IpcChannelInterface";
import { IpcRequest } from "../../IpcRequest";
import { FunctionDto, FunctionDtoMapper } from "../../dtos/FunctionDto";
import { ResultService } from "../../../core/services/ResultService";

export class GetFunctionsChannel implements IpcChannelInterface {
  constructor(
    private service : ResultService
  ) {}

  getName(): string {
    return 'results:getFunctions';
  }

  handle(_event: IpcMainEvent, request: IpcRequest): FunctionDto[] {
    console.log('Handling request on channel %s', this.getName())
    var functions = this.service.getFunctions();
    var functionsDto = functions.map((func) => FunctionDtoMapper.ModelToDto(func));
    return functionsDto;
  }
}