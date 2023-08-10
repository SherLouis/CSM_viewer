import { IpcMainEvent, IpcMainInvokeEvent} from "electron";
import { IpcRequest } from "./IpcRequest";

export interface IpcChannelInterface {
    getName(): string;

    handle(event: IpcMainInvokeEvent, request?: IpcRequest): any;
}