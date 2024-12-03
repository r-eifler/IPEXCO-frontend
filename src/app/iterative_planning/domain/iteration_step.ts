import { PlanningTask } from "src/app/shared/domain/planning-task";
import { GlobalExplanation } from "./explanation/explanations";
import { Plan } from "./plan";

export enum StepStatus {
    unknown,
    solvable,
    unsolvable,
  }

  export interface IterationStep {
    _id: string;
    name: string;
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

