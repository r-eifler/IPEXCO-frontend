
import { sum } from "ramda";
import { factEquals, PDDLAction, PDDLFact } from "src/app/shared/domain/PDDL_task";
import { Action, ActionZ, PlanProperty } from "src/app/shared/domain/plan-property/plan-property";
import { array, coerce, date, nativeEnum, object, string, infer as zinfer } from "zod";


export enum PlanRunStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  SOLVED = "SOLVED",
  UNSOLVABLE = "UNSOLVABLE",
  NO_PLAN_FOUND = "NO_PLAN_FOUND",
  CANCELED = "CANCELED",
  FAILED = "FAILED",
}

export const PlanRunStatusZ = nativeEnum(PlanRunStatus);

export const PlanZ = object({
  createdAt: coerce.date(), 
  status: PlanRunStatusZ,
  actions: array(ActionZ).nullish(),
  satisfied_properties: array(string()).optional(),
});

export type Plan = zinfer<typeof PlanZ>;

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
  if(!plan || !planProperties || !plan.satisfied_properties){
    return undefined;
  }
  if(plan.satisfied_properties.some(ppId => !planProperties[ppId])){
    return undefined;
  }
  return sum(plan.satisfied_properties?.map(ppId => planProperties[ppId].utility));
}
