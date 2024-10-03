
import { factEquals, PDDLAction, PDDLFact } from "src/app/interface/planning-task";


export enum PlanRunStatus {
  pending,
  running,
  failed,
  plan_found,
  not_solvable
}

export interface PlanAction {
  name: string,
  arguments: string[]
}


export interface Plan{
  createdAt?: Date;
  status: PlanRunStatus;
  actions?: PlanAction[];
  satisfied_properties?: string[];
  cost: number;
}

export interface State {
  values: PDDLFact[]
}

export function nextState(state: State, action: PDDLAction): State {
  console.log('Compute Next State: ' + action.name);
  let new_values = [...state.values];
  for (const eff of action.effect) {
    if (eff.negated) {
      const index = new_values.findIndex((e) => factEquals(e, eff));
      // console.log(index);
      new_values.splice(index, 1);
      // console.log("delete: " + eff)
    } else {
      new_values.push(eff);
      // console.log("add: " + eff)
    }
    // console.log(new_values.map(v => v.toString()));
  }
  new_values.sort();
  return { values: new_values };
}
