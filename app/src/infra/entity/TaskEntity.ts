import { Task } from "../../core/models/Task"

export type TaskEntity = {
    id: number
    level: string,
    category: string,
    subcategory: string,
    characteristic: string,
    is_manual: number
}

export const TaskEntityToModel = (entity: TaskEntity): Task => {
    return {
        level: entity.level,
        category: entity.category,
        subcategory: entity.subcategory,
        characteristic: entity.characteristic,
        is_manual: entity.is_manual > 0,
    } as Task
}