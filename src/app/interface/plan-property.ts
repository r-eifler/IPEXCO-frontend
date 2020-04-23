import { LtlFormula} from './ltl-formula';
import {Goal} from './goal';

export interface Action {
  _id?: string;
  name: string;
  params: string[];
}

export interface ActionSet {
  _id?: string;
  name: string;
  actions: Action[];
}

export interface PlanProperty extends Goal {
  _id?: string;
  type: string;
  formula: LtlFormula;
  actionSets: ActionSet[];
  project: string;
}
