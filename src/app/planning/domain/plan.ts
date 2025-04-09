import { PlanRunStatusZ } from "src/app/iterative_planning/domain/plan";
import { ActionZ } from "src/app/shared/domain/plan-property/plan-property";
import { array, coerce, number, object, string, unknown, infer as zinfer } from "zod";


export const PlanBaseZ = object({
    name: string(),
    project: string(),
    planner: string(),
    status: PlanRunStatusZ,
    actions: array(unknown()).nullish(),
    runTime: number().nullish(),
});

export type PlanBase = zinfer<typeof PlanBaseZ>;

export const PlanZ = PlanBaseZ.merge(object({
    _id: string(),
    createdAt: coerce.date(), 
    user: string()
}));

export type Plan = zinfer<typeof PlanZ>;

