import { TaskDdo } from "../../ui/models/TaskDdo";
import { Task } from "../../core/models/Task";

export type TaskDto = {
    level: string,
    category: string,
    subcategory: string,
    characteristic: string,
    is_manual: boolean
}

export class TaskDtoMapper {
    public static ModelToDto = (model: Task) => {
        return model as TaskDto;
    }

    public static DtoToDdo = (dto: TaskDto) => {
        return dto as TaskDdo;
    }
}