import { PlanningTask } from "src/app/shared/domain/planning-task";
import { GlobalExplanation } from "./explanation/explanations";
import { computeUtility, Plan } from "./plan";
import { PlanProperty } from "src/app/shared/domain/plan-property/plan-property";

export enum StepStatus {
    unknown,
    solvable,
    unsolvable
  }

  export interface IterationStep {
    _id?: string;
    name: string;
    user?: string;
    createdAt?: Date;
    project: string;
    status: StepStatus;
    hardGoals: string[];
    softGoals: string[];
    task: PlanningTask;
    plan?: Plan;
    globalExplanation?: GlobalExplanation,
    predecessorStep: string | null;
}

export interface ModIterationStep extends IterationStep {
  baseStep: string;
}


export function computeCurrentMaxUtility(steps: IterationStep[], planProperties: Record<string,PlanProperty>){
  const stepUtilities = steps?.map(s => s.status !== StepStatus.solvable ? 0 : computeUtility(s.plan, planProperties));
  return Math.max(...stepUtilities);
}