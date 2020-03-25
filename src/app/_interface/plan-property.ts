import { LtlFormula} from './ltl-formula';

export interface PlanProperty {
  id: number;
  name: string;
  selected: boolean;
  formula: LtlFormula;
}
