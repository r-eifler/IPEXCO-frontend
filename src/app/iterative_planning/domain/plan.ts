
import { sum } from "ramda";
import { factEquals, PDDLAction, PDDLFact } from "src/app/shared/domain/PDDL_task";
import { Action, PlanProperty } from "src/app/shared/domain/plan-property/plan-property";


export enum PlanRunStatus {
  pending,
  running,
  failed,
  plan_found,
  not_solvable,
  canceled
}


export interface Plan{
  createdAt: Date;
  status: PlanRunStatus;
  actions: Action[] | null;
  satisfied_properties: string[];
  cost: number;
}

export interface State {
  values: PDDLFact[]
}

export function nextState(state: State, action: PDDLAction): State {
  let new_values = [...state.values];
  for (const eff of action.effect) {
    if (eff.negated) {
      const index = new_values.findIndex((e) => factEquals(e, eff));
      new_values.splice(index, 1);
    } else {
      new_values.push(eff);
    }
  }
  new_values.sort();
  return { values: new_values };
}


export function computeUtility(plan: Plan, planProperties: Record<string, PlanProperty>) {
  if(!plan || !planProperties){
    return undefined;
  }
  if(plan.satisfied_properties.some(ppId => !planProperties[ppId])){
    return undefined;
  }
  return sum(plan.satisfied_properties?.map(ppId => planProperties[ppId].utility));
}
