import {
  GoalType,
  PlanProperty,
} from "src/app/interface/plan-property/plan-property";
import { Action } from "./plannig-task";

const zip = (a, b) => a.map((k, i) => [k, b[i]]);

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
  parameters: { name: string; type: string }[];
  predcondition: string[];
  effects: string[];
}

function replace(s: string, n_map): string {
  for (let [key, value] of n_map) {
    s = s.replace(key, value);
  }
  return s;
}

export function instantiateSchemaAction(
  action: SchemaAction,
  args: string[]
): Action {
  let args_map = new Map();
  for (let i = 0; i < args.length; i++) {
    args_map.set(action.parameters[i].name, args[i]);
  }
  let i_precon = [];
  for (const pre of action.predcondition) {
    i_precon.push(replace(pre, args_map));
  }
  let i_eff = [];
  for (const eff of action.effects) {
    i_eff.push(replace(eff, args_map));
  }
  return null; //TODO remove this class completely
}

export interface TaskSchema {
  types: string[];
  objects: SchemaObject[];
  actions: SchemaAction[];
  init: string[];
  goals: PlanProperty[];
}
