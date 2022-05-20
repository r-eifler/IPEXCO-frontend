import { factEquals } from "src/app/interface/plannig-task";
import {
  PPDependencies,
  PPConflict,
  RelaxationExplanationNode,
} from "./explanations";
import { PlanProperty } from "./plan-property/plan-property";
import {
  ModifiedPlanningTask,
  PlanningTaskRelaxationSpace,
  MetaFact,
} from "./planning-task-relaxation";

export enum StepStatus {
  unknown,
  solvable,
  unsolvable,
}

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

export interface RelaxationExplanationRun {
  _id: string;
  createdAt?: Date;
  name: string;
  status: RunStatus;
  relaxationSpace: string;
  log: string;
  result: string;
  dependencies?: RelaxationExplanationNode[];
}

export interface DepExplanationRun {
  _id?: string;
  createdAt?: Date;
  name: string;
  status: RunStatus;
  hardGoals: string[];
  softGoals: string[];
  log?: string;
  result?: string;
  dependencies?: PPDependencies;
  relaxationExplanations?: RelaxationExplanationRun[];
}

export interface IterationStep {
  _id?: string;
  name: string;
  createdAt?: Date;
  project: string;
  status: StepStatus;
  hardGoals: string[];
  softGoals: string[];
  task: ModifiedPlanningTask;
  plan?: PlanRun;
  depExplanation?: DepExplanationRun;
  relaxationExplanations?: RelaxationExplanationRun[];
}

export interface ModIterationStep extends IterationStep {
  baseStep: IterationStep;
}

export function computePlanValue(
  step: IterationStep,
  planProperties: Map<string, PlanProperty>
): number {
  // console.log("Compute plan value ...");
  if (step.status == StepStatus.solvable) {
    let sum = 0;
    // console.log(step);
    step.hardGoals.forEach((ppID) => {
      let pp = planProperties.get(ppID);
      if (pp){
        sum += pp.value;
        // console.log(ppID + ": " + pp.value )
      }
      else console.log(ppID);
    });
    // console.log("----> " + sum);
    return sum;
  }
  if (step.status == StepStatus.unsolvable) {
    return 0;
  }
  if (step.status == StepStatus.unknown) {
    return null;
  }
}

export function computeRelaxationCost(
  step: IterationStep,
  relaxationSpeaces: PlanningTaskRelaxationSpace[]
): number {
  let cost = 0;
  relaxationSpeaces.forEach((space) => {
    space.dimensions.forEach((dim) => {
      let match = step.task.initUpdates.find((iu) =>
        factEquals(iu.orgFact, dim.orgFact.fact)
      );
      if (match) {
        let update = [dim.orgFact, ...dim.updates].find((u) =>
          factEquals(u.fact, match.newFact)
        );
        cost += update.value;
      }
    });
  });
  return cost;
}

export function computeStepUtility(step, planProperties: Map<string, PlanProperty>, relaxationSpeaces: PlanningTaskRelaxationSpace[]): number {
  return computePlanValue(step, planProperties) - computeRelaxationCost(step, relaxationSpeaces);
}

function filterDependencies(
  question: string,
  hardGoals: string[],
  allDependencies: PPDependencies
): PPDependencies {
  let g = [question, ...hardGoals];
  let filteredDependencies: PPDependencies = { conflicts: [] };
  for (let conflict of allDependencies.conflicts) {
    if (
      g.filter((f) => conflict.elems.includes(f)).length ==
      conflict.elems.length
    ) {
      filteredDependencies.conflicts.push({
        elems: conflict.elems.filter((e) => e != question),
      });
    }
  }
  return filteredDependencies;
}

export function getDependencies(step: IterationStep, question: string): PPDependencies {
  console.log("getDependencies");
  if (step.relaxationExplanations && step.relaxationExplanations.length > 0) {
    return filterDependencies(
      question,
      step.hardGoals,
      step.relaxationExplanations[0].dependencies[0].dependencies
    );
  }
  if (step.depExplanation) {
    return filterDependencies(
      question,
      step.hardGoals,
      step.depExplanation.dependencies
    );
  }

  return null;
}

function filterDependenciesForUnsolvability(hardGoals: string[], allDependencies: PPDependencies): PPDependencies {
  let filteredDependencies: PPDependencies = { conflicts: [] };
  for (let conflict of allDependencies.conflicts) {
    if (conflict.elems.every((ce) => hardGoals.some((hg) => ce == hg))) {
      filteredDependencies.conflicts.push({ elems: conflict.elems });
    }
  }
  return filteredDependencies;
}

export function getDependenciesForUnsolvability(
  step: IterationStep
): PPDependencies {
  console.log("getDependenciesForUnsolvability");
  if (step.relaxationExplanations && step.relaxationExplanations.length > 0) {
    return filterDependenciesForUnsolvability(
      step.hardGoals,
      step.relaxationExplanations[0].dependencies[0].dependencies
    );
  }
  if (step.depExplanation) {
    return filterDependenciesForUnsolvability(
      step.hardGoals,
      step.depExplanation.dependencies
    );
  }

  return null;
}

export function isStepSolvable(step: IterationStep): boolean {
  if (step.relaxationExplanations && step.relaxationExplanations.length > 0) {
    return (
      filterDependenciesForUnsolvability(
        step.hardGoals,
        step.relaxationExplanations[0].dependencies[0].dependencies
      ).conflicts.length == 0
    );
  }
  if (step.depExplanation) {
    return (
      filterDependenciesForUnsolvability(
        step.hardGoals,
        step.depExplanation.dependencies
      ).conflicts.length == 0
    );
  }

  return null;
}

function findRelaxationNodes(
  conflict: PPConflict,
  explanationTree: RelaxationExplanationNode[]
): RelaxationExplanationNode[] {
  //TODO fix finding the real minimal
  let minimalNodes: RelaxationExplanationNode[] = [];
  let todo: number[] = [0];
  let done: Set<number> = new Set();
  while (todo.length > 0) {
    let index = todo.shift();
    done.add(index);
    let node = explanationTree[index];
    let found = false;
    for (let c of node.dependencies.conflicts) {
      if (conflict.elems.every((e) => c.elems.includes(e))) {
        found = true;
        break;
      }
    }
    if (found) {
      node.upper_cover.forEach((i) => {
        if (!done.has(i)) todo.push(i);
      });
    }
    if (!found) {
      minimalNodes.push(node);
    }
    index++;
  }
  return minimalNodes;
}

export function getRelaxationExplanationsFromStep(
  step: IterationStep,
  conflict: PPConflict,
  relaxationSpeace: PlanningTaskRelaxationSpace
): RelaxationExplanationNode[] {
  let relaxExp = step.relaxationExplanations.find(
    (relaxExp) => relaxExp.relaxationSpace == relaxationSpeace._id
  );
  let nodes = findRelaxationNodes(conflict, relaxExp.dependencies);
  return nodes;
}
