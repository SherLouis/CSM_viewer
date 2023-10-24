import { IpcMainEvent } from "electron";
import { IpcChannelInterface } from "../../IpcChannelInterface";
import { IpcRequest } from "../../IpcRequest";
import { TaskDto, TaskDtoMapper } from "../../dtos/TaskDto";
import { ResultService } from "../../../core/services/ResultService";

export class GetTasksChannel implements IpcChannelInterface {
  constructor(
    private service : ResultService
  ) {}

  getName(): string {
    return 'results:getTasks';
  }

  handle(_event: IpcMainEvent, request: IpcRequest): TaskDto[] {
    console.log('Handling request on channel %s', this.getName())
    var tasks = this.service.getTasks();
    var tasksDto = tasks.map((task) => TaskDtoMapper.ModelToDto(task));
    return tasksDto;
  }
}