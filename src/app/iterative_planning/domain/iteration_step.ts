import { PlanningTask } from "src/app/interface/planning-task";
import { Explanation } from "./explanation/explanations";
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
    explanations: Explanation[];
    predecessorStep: string | null;
}

  export interface ModIterationStep extends IterationStep {
    baseStep: string;
  }

