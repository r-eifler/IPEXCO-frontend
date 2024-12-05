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

export interface PlanRun {
  _id?: string;
  createdAt?: Date;
  name: string;
  status: RunStatus;
  log?: string;
  result?: string;
  satPlanProperties?: string[];
}



export function computePlanValue( step: IterationStep, planProperties: Record<string, PlanProperty>): number | undefined {
  if (step.plan === undefined || 
      step.plan.status == PlanRunStatus.failed ||
      step.plan.status == PlanRunStatus.running ||
      step.plan.status == PlanRunStatus.pending 
    ) {
    return null;
  }
  if (step.plan.status == PlanRunStatus.not_solvable) {
    return 0;
  }

  if (step.status == StepStatus.solvable) {
    return step.plan.satisfied_properties.map(pid => planProperties.pid.utility).reduce((acc, v) => acc + v,0);
  }

  return null
}



export function computeStepUtility(step, planProperties: Record<string, PlanProperty>): number {
  return computePlanValue(step, planProperties);
}

// function filterDependencies(
//   question: string,
//   hardGoals: string[],
//   allDependencies: PPDependencies
// ): PPDependencies {
//   let g = [question, ...hardGoals];
//   let filteredDependencies: PPDependencies = { conflicts: [] };
//   for (let conflict of allDependencies.conflicts) {
//     if (
//       g.filter((f) => conflict.elems.includes(f)).length ==
//       conflict.elems.length
//     ) {
//       filteredDependencies.conflicts.push({
//         elems: conflict.elems.filter((e) => e != question),
//       });
//     }
//   }
//   return filteredDependencies;
// }

// export function getAllDependencies(step: IterationStep): PPDependencies {
//   if (step.relaxationExplanations && step.relaxationExplanations.length > 0) {
//     return step.relaxationExplanations[0].dependencies[0].dependencies;
//   }
//   if (step.depExplanation) {
//     return step.depExplanation.dependencies;
//   }

//   return null;
// }

// export function getAllReleventDependencies(step: IterationStep): PPDependencies {
//   let dependencies : PPDependencies;
//   if (step.relaxationExplanations && step.relaxationExplanations.length > 0) {
//     dependencies = step.relaxationExplanations[0].dependencies[0].dependencies;
//   }
//   if (step.depExplanation) {
//     dependencies = step.depExplanation.dependencies;
//   }
//   let filteredDependencies: PPDependencies = { conflicts: [] };
//   filteredDependencies.conflicts = dependencies.conflicts.filter((c : PPConflict) => step.plan.satPlanProperties.some(p => c.elems.find(e => e === p)))
//   return filteredDependencies;
// }

// export function getDependencies(step: IterationStep, question: string): PPDependencies {
//   console.log("getDependencies");
//   if (step.relaxationExplanations && step.relaxationExplanations.length > 0) {
//     return filterDependencies(
//       question,
//       step.hardGoals,
//       step.relaxationExplanations[0].dependencies[0].dependencies
//     );
//   }
//   if (step.depExplanation) {
//     return filterDependencies(
//       question,
//       step.hardGoals,
//       step.depExplanation.dependencies
//     );
//   }

//   return null;
// }

// function filterDependenciesForUnsolvability(hardGoals: string[], allDependencies: PPDependencies): PPDependencies {
//   let filteredDependencies: PPDependencies = { conflicts: [] };
//   for (let conflict of allDependencies.conflicts) {
//     if (conflict.elems.every((ce) => hardGoals.some((hg) => ce == hg))) {
//       filteredDependencies.conflicts.push({ elems: conflict.elems });
//     }
//   }
//   return filteredDependencies;
// }

// export function getDependenciesForUnsolvability(
//   step: IterationStep
// ): PPDependencies {
//   console.log("getDependenciesForUnsolvability");
//   if (step.relaxationExplanations && step.relaxationExplanations.length > 0) {
//     return filterDependenciesForUnsolvability(
//       step.hardGoals,
//       step.relaxationExplanations[0].dependencies[0].dependencies
//     );
//   }
//   if (step.depExplanation) {
//     return filterDependenciesForUnsolvability(
//       step.hardGoals,
//       step.depExplanation.dependencies
//     );
//   }

//   return null;
// }



