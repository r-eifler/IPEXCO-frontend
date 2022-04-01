import { PlanningTask } from 'src/app/interface/plannig-task';
import { Fact } from "./plannig-task"


export class FactUpdate {
  orgFact: Fact;
  newFact: Fact;

  constructor(orgFact: Fact, newFact: Fact) {
      this. orgFact = orgFact;
      this.newFact = newFact;
  }

  static fromObject(o: FactUpdate){
      return new FactUpdate(Fact.fromObject(o.orgFact), Fact.fromObject(o.newFact));
  }
}

export class MetaFact {
  fact: Fact;
  value: number;
  display: string;

  constructor(newFact: Fact, value: number, display: string) {
      this.fact = newFact;
      this.value = value;
      this.display = display;
  }

  static fromObject(o: MetaFact){
      return new MetaFact(Fact.fromObject(o.fact), o.value, o.display);
  }
}

export class PossibleInitFactUpdates{
  public orgFact: MetaFact;
  public updates: MetaFact[];

  constructor(orgFact: MetaFact, updates: MetaFact[]) {
    this. orgFact = orgFact;
    this.updates = updates;
  }

  static fromObject(o: PossibleInitFactUpdates){
    return new PossibleInitFactUpdates(MetaFact.fromObject(o.orgFact), o.updates.map(e => MetaFact.fromObject(e)));
  }
}

export class PlanningTaskRelaxationSpace {
  public _id?: string;
  public name: string;
  public project: string;
  public possibleInitFactUpdates: PossibleInitFactUpdates[];

  constructor(name: string, project: string, initUpdates: PossibleInitFactUpdates[]) {
    this.name = name;
    this.project = project;
    this.possibleInitFactUpdates = initUpdates;
  }

  static fromObject(o: PlanningTaskRelaxationSpace){
    let space = new PlanningTaskRelaxationSpace(o.name, o.project, o.possibleInitFactUpdates.map(e => PossibleInitFactUpdates.fromObject(e)));
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
  initUpdates: FactUpdate[];

  constructor(name: string, project: string, baseTask: PlanningTask, initUpdates: FactUpdate[]) {
    this.name = name;
    this.project = project;
    this.basetask = baseTask;
    this.initUpdates = initUpdates;
  }

  static fromObject(o: ModifiedPlanningTask) {
    let task = new ModifiedPlanningTask(o.name, o.project, PlanningTask.fromObject(o.basetask), o.initUpdates.map(e => FactUpdate.fromObject(e)));
    if(o._id){
      task._id = o._id
    }
    return task;
  }
}
