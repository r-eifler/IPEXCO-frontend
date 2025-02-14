import { PlanningTask } from "src/app/shared/domain/planning-task";
import { GlobalExplanation } from "./explanation/explanations";
import { computeUtility, Plan } from "./plan";
import { PlanProperty } from "src/app/shared/domain/plan-property/plan-property";

export enum StepStatus {
    unknown,
    solvable,
    unsolvable
}

export interface IterationStepBase {
    name: string;
    project: string;
    status: StepStatus;
    hardGoals: string[];
    softGoals: string[];
    task: PlanningTask;
    plan?: Plan;
    globalExplanation?: GlobalExplanation,
    predecessorStep: string | null;
}

export interface IterationStep extends IterationStepBase{
    _id: string;
    user: string;
    createdAt: Date;
}

export interface ModIterationStep extends IterationStepBase {
  baseStep: string;
}


export function computeCurrentMaxUtility(
  steps: IterationStep[], 
  planProperties: Record<string,PlanProperty>
){
  const stepUtilities = steps?.map(s => 
    s.status !== StepStatus.solvable || s.plan === undefined || s.plan == null ? 
    0 : 
    computeUtility(s.plan, planProperties)
  ).filter(v => v !== undefined);
  return Math.max(...stepUtilities);
}