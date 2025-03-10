
import { array, object, string, infer as zinfer } from "zod";

export const TaskObjectZ = object({
  name: string(),
  type: string()
});

export type TaskObject = zinfer<typeof TaskObjectZ>;

export const BaseModel = object({
  objects: array(TaskObjectZ)
})

export type BaseModel = zinfer<typeof BaseModel>;

export const PlanningTaskZ = object({
  name: string(),
  model: BaseModel
});

export type PlanningTask = zinfer<typeof PlanningTaskZ>