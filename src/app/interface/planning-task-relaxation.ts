import { factEquals, PlanningTask } from 'src/app/interface/plannig-task';
import { Fact } from "./plannig-task"


export interface FactUpdate {
  orgFact: Fact,
  newFact: Fact
}

export interface MetaFact {
  fact: Fact,
  value: number,
  display: string
}

export interface PossibleInitFactUpdates{
  orgFact: MetaFact,
  updates: MetaFact[]
}

export interface PlanningTaskRelaxationSpace {
  _id?: string,
  name: string,
  project: string,
  possibleInitFactUpdates: PossibleInitFactUpdates[]
}

export interface ModifiedPlanningTask{
  _id?: string,
  name: string,
  project: string,
  basetask: PlanningTask,
  initUpdates: FactUpdate[]
}

export function getUpdatedInitialState(modTask : ModifiedPlanningTask): Fact[] {

  let initial = modTask.basetask.initial.filter(f => ! modTask.initUpdates.some(u => factEquals(u.orgFact, f)));
  modTask.initUpdates.forEach(u => initial.push(u.newFact));

  return initial;
}

export function getMaxRelaxationCost(spaces : PlanningTaskRelaxationSpace[]): number {
  let sum = 0;
  spaces.forEach(space => {
    for(let dim of space.possibleInitFactUpdates){
      sum += Math.max(...dim.updates.map(u => u.value))
    }
  })
  return sum;
}
