import { PlanningTask } from 'src/app/interface/plannig-task';
import { Fact } from "./plannig-task"

export class InitFactUpdate {
  orgFact: Fact;
  newFact: Fact;
  value: number;

  constructor(orgFact: Fact, newFact: Fact, value: number) {
    this. orgFact = orgFact;
    this.newFact = newFact;
    this.value = value;
  }

  static fromObject(o: InitFactUpdate){
    return new InitFactUpdate(Fact.fromObject(o.orgFact), Fact.fromObject(o.newFact), o.value);
  }
}

export class PossibleInitFactUpdate{
  public orgFact: Fact;
  public updates: {fact: Fact, value: number}[];

  constructor(orgFact: Fact, updates: {fact: Fact, value: number}[]) {
    this. orgFact = orgFact;
    this.updates = updates;
  }

  static fromObject(o: PossibleInitFactUpdate){
    return new PossibleInitFactUpdate(Fact.fromObject(o.orgFact), o.updates.map(e => {return {fact: Fact.fromObject(e.fact), value: e.value}}));
  }
}

export class PlanningTaskRelaxationSpace {
  public _id?: string;
  public name: string;
  public project: string;
  public possibleInitFactUpdates: PossibleInitFactUpdate[];

  constructor(name: string, project: string, initUpdates: PossibleInitFactUpdate[]) {
    this.name = name;
    this.project = project;
    this.possibleInitFactUpdates = initUpdates;
  }

  static fromObject(o: PlanningTaskRelaxationSpace){
    let space = new PlanningTaskRelaxationSpace(o.name, o.project, o.possibleInitFactUpdates.map(e => PossibleInitFactUpdate.fromObject(e)));
    if(o._id){
      space._id = o._id
    }
    return space;
  }
}

export class ModifiedPlanningTask{
  _id?: string;
  name: string;
  project: string;
  basetask: PlanningTask;
  initUpdates: InitFactUpdate[];

  constructor(name: string, project: string, baseTask: PlanningTask, initUpdates: InitFactUpdate[]) {
    this.name = name;
    this.project = project;
    this.basetask = baseTask;
    this.initUpdates = initUpdates;
  }

  static fromObject(o: ModifiedPlanningTask) {
    let task = new ModifiedPlanningTask(o.name, o.project, PlanningTask.fromObject(o.basetask), o.initUpdates.map(e => InitFactUpdate.fromObject(e)));
    if(o._id){
      task._id = o._id
    }
    return task;
  }
}
