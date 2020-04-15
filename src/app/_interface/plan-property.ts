import { LtlFormula} from './ltl-formula';
import {Goal} from './goal';

export interface ActionSet {
  _id: string;
  name: string;
  actions: string[];
}

export interface PlanProperty extends Goal {
  _id: string;
  type: string;
  formula: LtlFormula;
  actionSets: ActionSet[];
}
