import { IpcMainEvent } from "electron";
import { IpcChannelInterface } from "../../IpcChannelInterface";
import { IpcRequest } from "../../IpcRequest";
import { ResultService } from "../../../core/services/ResultService";

export class GetBodyPartsChannel implements IpcChannelInterface {
  constructor(
    private service : ResultService
  ) {}

  getName(): string {
    return 'results:getBodyParts';
  }

  handle(_event: IpcMainEvent, request: IpcRequest): String[] {
    console.log('Handling request on channel %s', this.getName())
    var bodyParts = this.service.getBodyParts();
    return bodyParts;
  }
}