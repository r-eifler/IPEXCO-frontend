import { Action } from './plan';
import {GoalType, PlanProperty} from 'src/app/interface/plan-property/plan-property';

const zip = (a, b) => a.map((k, i) => [k, b[i]]);

export interface SchemaObject {
  name: string;
  type: string;
}

export interface SchemaPredicat {
  name: string;
  arguments: string[];
}

export class SchemaAction {
  name: string;
  parameters: {name: string; type: string}[];
  predcondition: string[];
  effects: string[];

  constructor(name: string, parameters: {name: string; type: string}[], precondition: string[], effects: string[]){
    this.name =  name;
    this.parameters = parameters;
    this.predcondition = precondition;
    this.effects = effects;
  }

  replace(s: string, n_map): string {
    for (let [key, value] of n_map) {
      s = s.replace(key, value)
    }
    return s;
  }

  instantiate(args: string[]): Action {
      let args_map = new Map()
      for (let i = 0; i < args.length; i++) {
        args_map.set(this.parameters[i].name,args[i])
      }
      let i_precon = []
      for (const pre of this.predcondition){
          i_precon.push(this.replace(pre,args_map))
      }
      let i_eff = []
      for (const eff of this.effects){
        i_eff.push(this.replace(eff,args_map))
      }
      return {name: this.name, args, precondition: i_precon, effects: i_eff}
  }
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
    this.actions = [];
    for(const a of json.actions){
      this.actions.push(
        new SchemaAction(a.name, a.parameters, a.precondition, a.effects))
    }
    this.init = json.init;
    this.goals = json.goal.map((g: string) => {
      return {name: g, goalType: GoalType.goalFact};
    });
  }

}
