import { factEquals, PlanningTask } from "src/app/interface/planning-task";
import { PDDLFact } from "./planning-task";

export interface FactUpdate {
  orgFact: PDDLFact;
  newFact: PDDLFact;
}

export interface MetaFact {
  fact: PDDLFact;
  value: number;
  display: string;
}

export interface RelaxationDimension {
  name: string;
  orgFact: MetaFact;
  updates: MetaFact[];
}

export interface PlanningTaskRelaxationSpace {
  _id?: string;
  name: string;
  project: string;
  dimensions: RelaxationDimension[];
}

export interface ModifiedPlanningTask {
  _id?: string;
  name: string;
  project: string;
  basetask: PlanningTask;
  initUpdates: FactUpdate[];
}

export function getUpdatedInitialState(modTask: ModifiedPlanningTask): PDDLFact[] {
  let initial = modTask.basetask.model.initial.filter(
    (f) => !modTask.initUpdates.some((u) => factEquals(u.orgFact, f))
  );
  modTask.initUpdates.forEach((u) => initial.push(u.newFact));

  return initial;
}

export function getMaxRelaxationCost(
  spaces: PlanningTaskRelaxationSpace[]
): number {
  let sum = 0;
  spaces.forEach((space) => {
    for (let dim of space.dimensions) {
      sum += Math.max(...dim.updates.map((u) => u.value));
    }
  });
  return sum;
}
