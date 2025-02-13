import { PlanningTask } from "src/app/shared/domain/planning-task";
import { GlobalExplanation } from "./explanation/explanations";
import { computeUtility, Plan } from "./plan";
import { PlanProperty } from "src/app/shared/domain/plan-property/plan-property";
import { inputIsNotNullOrUndefined } from "src/app/shared/common/check_null_undefined";

export enum StepStatus {
    unknown,
    solvable,
    unsolvable
  }

  export interface IterationStepBase {
    name: string;
    createdAt: Date;
    project: string;
    status: StepStatus;
    hardGoals: string[];
    softGoals: string[];
    task: PlanningTask;
    plan?: Plan;
    globalExplanation: GlobalExplanation | null,
    predecessorStep: string | null;
}

export interface IterationStep extends IterationStepBase{
    _id: string;
    user: string;
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
  );
  return Math.max(...stepUtilities);
}