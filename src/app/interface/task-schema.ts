import { PlanProperty, GoalType } from 'src/app/interface/plan-property';
export interface SchemaObject {
  name: string;
  type: string;
}

export interface SchemaPredicat {
  name: string;
  arguments: string[];
}

export interface SchemaAction {
  name: string;
  parameters: {name: string; type: string}[];
}


export class TaskSchema {
  types: string[];
  objects: SchemaObject[];
  actions: SchemaAction[];
  init: string[];
  goals: PlanProperty[];

  constructor(json) {
    this.types = json.types;
    this.objects = json.objects;
    this.actions = json.actions;
    this.init = json.init;
    this.goals = json.goal.map((g: string) => {
      return {name: g, goalType: GoalType.goalFact};
    });
  }

}
