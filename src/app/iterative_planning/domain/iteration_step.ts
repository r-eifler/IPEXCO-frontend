import { PlanProperty } from "src/app/shared/domain/plan-property/plan-property";
import { PlanningTaskZ } from "src/app/shared/domain/planning-task";
import { array, coerce, nativeEnum, object, string, infer as zinfer } from "zod";
import { GlobalExplanationZ } from "./explanation/explanations";
import { computeUtility, PlanZ } from "./plan";

export enum StepStatus{
	UNKNOWN = "UNKNOWN",
	SOLVABLE = "SOLVABLE",
	UNSOLVABLE = "UNSOLVABLE",
}

export const StepStatusZ = nativeEnum(StepStatus);

export const IterationStepBaseZ = object({
	name: string(),
	project: string(),
	status: StepStatusZ,
	hardGoals: array(string()),
	softGoals: array(string()),
	task: PlanningTaskZ,
	plan: PlanZ.optional(),
	globalExplanation: GlobalExplanationZ.optional(),
	predecessorStep: string().nullable(),
});

export type IterationStepBase = zinfer<typeof IterationStepBaseZ>;

export const IterationStepZ = IterationStepBaseZ.merge(object({
    _id: string(),
    user: string(),
    createdAt: coerce.date(),
}));

export type IterationStep = zinfer<typeof IterationStepZ>;

export interface ModIterationStep extends IterationStepBase {
  baseStep: string;
}


export function computeCurrentMaxUtility(
  steps: IterationStep[], 
  planProperties: Record<string,PlanProperty>
){
  const stepUtilities = steps?.map(s => 
    s.status !== StepStatus.SOLVABLE || s.plan === undefined || s.plan == null ? 
    0 : 
    computeUtility(s.plan, planProperties)
  ).filter(v => v !== undefined);
  return Math.max(...stepUtilities);
}