import { nativeEnum, object, optional, string, infer as zinfer } from "zod";

export enum PlanMethodType {
  MANUAL = "MANUAL",
  AUTOMATIC_SEARCH_PLANNER = 'AUTOMATIC_SEARCH_PLANNER',
  ACTION_POLICY = 'ACTION_POLICY',
}

export const PlanMethodTypeZ = nativeEnum(PlanMethodType);

export const PlanMethodZ = object({
  type: PlanMethodTypeZ,
  name: string(),
  serviceId: optional(string()),
});

export type PlanMethod = zinfer<typeof PlanMethodZ>