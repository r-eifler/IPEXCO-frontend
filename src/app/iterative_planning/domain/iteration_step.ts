import { PlanningTask, UpdatedPlanningTask } from "src/app/interface/planning-task";
import { Plan } from "./plan";
import { Explanation } from "./explanations";

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
    explanation?: Explanation;
    predecessorStep: string | null;
}
  
  export interface ModIterationStep extends IterationStep {
    baseStep: IterationStep;
  }