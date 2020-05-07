import { LtlFormula} from './ltl-formula';
import {Goal} from './goal';

export interface Action {
  _id?: string;
  name: string;
  params: string[];
}

export function toAction(as: string): Action{
  const [name, ...params] = as.split(' ');
  return {name, params};
}

export interface ActionSet {
  _id?: string;
  name: string;
  actions: Action[];
}

export interface PlanProperty extends Goal {
  _id?: string;
  type: string;
  formula: string;
  actionSets: ActionSet[];
  naturalLanguageDescription?: string;
  project: string;
  isUsed: boolean;
}
