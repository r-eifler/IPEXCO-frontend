import { map } from 'rxjs/operators';
import { PlanningTask } from 'src/app/interface/plannig-task';
import { PPDependencies, PPConflict } from './explanations';
import {PlanProperty} from './plan-property/plan-property';
import {Project} from './project';
import {Plan} from './plan';
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
  dependencies?: PPDependencies[],
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
  return filterDependencies(question, step.hardGoals, step.relaxationExplanations[0].dependencies[0]);
}

function findRelaxationLevels(conflict: PPConflict, allDependencies: PPDependencies[]): number[] {
  let index = 0;
  for (let dep of allDependencies) {
    let found = false;
    for (let c of dep.conflicts) {
      if (conflict.elems.every(e => c.elems.includes(e))){
        found = true;
      }
    }
    if (! found) {
      return [index];
    }
    index++;
  }
  return [];
  }

export function getRelaxationExplanationsFromStep(step: IterationStep, conflict: PPConflict, relaxationSpeace: PlanningTaskRelaxationSpace): MetaFact[] {
  console.log(conflict);
  let relaxExp = step.relaxationExplanations.find(relaxExp => relaxExp.relaxationSpace == relaxationSpeace._id);
  let indexes = findRelaxationLevels(conflict, relaxExp.dependencies);
  let list = [relaxationSpeace.possibleInitFactUpdates[0].orgFact, ...relaxationSpeace.possibleInitFactUpdates[0].updates];
  return indexes.map(i => list[i]);
}



