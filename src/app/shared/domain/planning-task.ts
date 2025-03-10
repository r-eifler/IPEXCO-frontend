
import { array, object, record, string, unknown, infer as zinfer } from "zod";

export const TaskObjectZ = object({
  name: string(),
  type: string()
});

export type TaskObject = zinfer<typeof TaskObjectZ>;

export const PlanningTaskZ = object({
  name: string(),
  objects: array(TaskObjectZ),
  model: unknown()
});

export type PlanningTask = zinfer<typeof PlanningTaskZ>