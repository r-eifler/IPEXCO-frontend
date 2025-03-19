import { PlanProperty } from "../../shared/domain/plan-property/plan-property";
import { IterationStep, StepStatus } from "./iteration_step";
import { PlanRunStatus } from "./plan";



export enum RunStatus {
  pending,
  running,
  failed,
  finished,
  noSolution,
  notStarted,
}

// export interface PlanRun {
//   _id?: string;
//   createdAt: Date;
//   name: string;
//   status: RunStatus;
//   log: string | null;
//   result: string | null;
//   satPlanProperties: string[];
// }



export function computePlanValue( step: IterationStep, planProperties: Record<string, PlanProperty>): number | undefined {
  if (step.plan === undefined || 
      step.plan.status == PlanRunStatus.FAILED ||
      step.plan.status == PlanRunStatus.RUNNING ||
      step.plan.status == PlanRunStatus.PENDING 
    ) {
    return undefined;
  }
  if (step.plan.status == PlanRunStatus.UNSOLVABLE) {
    return 0;
  }

  if (step.status == StepStatus.SOLVABLE && step.plan?.satisfied_properties !== undefined) {
    return step.plan.satisfied_properties.map(pid => planProperties.pid.utility).reduce((acc, v) => acc + v,0);
  }

  return undefined
}



export function computeStepUtility(step: IterationStep, planProperties: Record<string, PlanProperty>) {
  return computePlanValue(step, planProperties);
}
