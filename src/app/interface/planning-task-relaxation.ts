import { Fact } from "./plannig-task"

export interface TaskUpdate {
  fact: Fact,
  value: number;
}

export class TaskUpdates{
  public orgFact: Fact;
  public newFacts: TaskUpdate[];

  constructor(orgFact: Fact, newFacts: TaskUpdate[]) {
    this.orgFact = orgFact;
    this.newFacts = newFacts;
  }

  static fromObject(o: TaskUpdates){
    return new TaskUpdates(Fact.fromObject(o.orgFact), o.newFacts.map(e => {return {fact: Fact.fromObject(e.fact), value: e.value}}));
  }
}

export class PlanningTaskRelaxationSpace {
  public _id?: string;
  public name: string;
  public project: string;
  public taskUpdatList: TaskUpdates[];

  constructor(name: string, project: string, taskUpdatList: TaskUpdates[]) {
    this.name = name;
    this.project = project;
    this.taskUpdatList = taskUpdatList;
  }

  static fromObject(o: PlanningTaskRelaxationSpace){
    let space = new PlanningTaskRelaxationSpace(o.name, o.project,
      o.taskUpdatList.map(e => TaskUpdates.fromObject(e)));
    if(o._id){
      space._id = o._id
    }
    return space;
  }
}
