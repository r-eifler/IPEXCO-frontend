import { PPDependencies, PPConflict, RelaxationExplanationNode } from './explanations';
import {PlanProperty} from './plan-property/plan-property';
import { ModifiedPlanningTask, PlanningTaskRelaxationSpace, MetaFact } from './planning-task-relaxation';

export enum StepStatus{
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

export interface PlanRun{
  _id?: string,
  createdAt?: Date,
  name: string,
  status: RunStatus,
  log?: string,
  result?: string,
  satPlanProperties?: string[],
}

export interface RelaxationExplanationRun{
  _id: string,
  createdAt?: Date,
  name: string,
  status: RunStatus,
  relaxationSpace: string,
  log: string,
  result: string,
  dependencies?: RelaxationExplanationNode[];
}

export interface DepExplanationRun{
  _id?: string,
  createdAt?: Date,
  name: string,
  status: RunStatus,
  hardGoals: string[],
  softGoals: string[],
  log?: string,
  result?: string,
  dependencies?: PPDependencies,
  relaxationExplanations?: RelaxationExplanationRun[]
}


export interface IterationStep{
  _id?: string,
  name: string,
  createdAt?: Date;
  project: string,
  status: StepStatus,
  hardGoals: string[],
  softGoals: string[],
  task: ModifiedPlanningTask,
  plan?: PlanRun,
  depExplanations?: DepExplanationRun[],
  relaxationExplanations?: RelaxationExplanationRun[],
}

export interface ModIterationStep extends IterationStep{
  baseStep: IterationStep
}

export function planValue(step: IterationStep, planProperties: Map<string,PlanProperty>) {
  return step.plan.satPlanProperties.reduce((acc, cur) => acc + planProperties.get(cur).value, 0)
}

function filterDependencies(question: string, hardGoals: string[], allDependencies: PPDependencies): PPDependencies {
  let g =[question, ...hardGoals];
  let filteredDependencies : PPDependencies = {conflicts: []};
  for(let conflict of allDependencies.conflicts) {
    if(g.filter(f => conflict.elems.includes(f)).length == conflict.elems.length){
      filteredDependencies.conflicts.push({elems: conflict.elems.filter(e => e != question)});
    }
  }
  return filteredDependencies;
 }

export function getDependencies(step: IterationStep, question: string): PPDependencies {
  if(! step.relaxationExplanations) {
    return null;
  }
  return filterDependencies(question, step.hardGoals, step.relaxationExplanations[0].dependencies[0].dependencies);
}

function findRelaxationNodes(conflict: PPConflict, explanationTree: RelaxationExplanationNode[]): RelaxationExplanationNode[] {
  //TODO fix finding the real minimal
  let minimalNodes: RelaxationExplanationNode[] = [];
  let todo : number[] = [0];
  let done : Set<number> = new Set();
  while (todo.length > 0) {
    let index = todo.shift();
    done.add(index);
    let node = explanationTree[index];
    let found = false;
    for (let c of node.dependencies.conflicts) {
      if (conflict.elems.every(e => c.elems.includes(e))){
        found = true;
        break;
      }
    }
    if (found) {
      node.upper_cover.forEach(i => {if(!done.has(i)) todo.push(i)});
    }
    if (! found) {
      minimalNodes.push(node);
    }
    index++;
  }
  return minimalNodes;
  }

export function getRelaxationExplanationsFromStep(step: IterationStep, conflict: PPConflict, relaxationSpeace: PlanningTaskRelaxationSpace): RelaxationExplanationNode[] {
  let relaxExp = step.relaxationExplanations.find(relaxExp => relaxExp.relaxationSpace == relaxationSpeace._id);
  let nodes = findRelaxationNodes(conflict, relaxExp.dependencies);
  return nodes
}


