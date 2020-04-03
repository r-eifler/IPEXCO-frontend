import { LtlFormula} from './ltl-formula';

export interface ActionSet {
  _id: string;
  name: string;
  actions: string[];
}

export interface PlanProperty {
  _id: string;
  name: string;
  type: string;
  formula: LtlFormula;
  actionSets: ActionSet[];
}
