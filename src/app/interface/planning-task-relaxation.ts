import { Fact } from "./plannig-task"

export interface TaskUpdates{
  orgFact: Fact;
  newFacts: {fact: Fact, value: number}[];
}

export interface PlanningTaskRelaxationSpace {
  _id?: string;
  name: string;
  project: string,
  taskUpdatList: TaskUpdates[];
}
