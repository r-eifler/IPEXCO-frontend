import { array, infer as zinfer, nativeEnum, object, string } from "zod";

export interface Action {
  name: string;
  params: string[];
}

export function toAction(as: string): Action {
  const [name, ...params] = as.split(" ");
  return { name, params };
}

export interface ActionSet {
  name: string;
  actions: Action[];
}

export function equalActionSets(a1: ActionSet[] | undefined, a2: ActionSet[] | undefined): boolean {
  if(a1 === undefined && a2 == undefined){
    return true;
  }
  if(a1 === undefined || a2 == undefined){
    return false;
  }
  // TODO
  return false;
}

export enum GoalType {
  goalFact = "G",
  LTL = "LTL",
  AS = "AS",
  DOMAIN_DEPENDENT = "DOMAIN_DEPENDENT",
}

export const GoalTypeZ = nativeEnum(GoalType);

export const PlanPropertyDefinitionZ  = object({
  name: string(),
  parameters: array(string()),
});

export type PlanPropertyDefinition = zinfer<typeof PlanPropertyDefinitionZ>;

export interface PlanPropertyBase {
  name: string;
  definition: PlanPropertyDefinition | null; 
  naturalLanguageDescription?: string;
  type: GoalType;
  formula: string | null;
  actionSets?: ActionSet[]; //LtL over actions : unsupported yet for LLM
  isUsed: boolean;
  globalHardGoal: boolean;
  utility: number;
  color: string;
  icon: string;
  class: string;
}

export interface PlanProperty extends PlanPropertyBase{
  _id: string;
  project: string;
}

export function equalPlanProperties(p1: PlanPropertyBase, p2: PlanPropertyBase): boolean {
  const res =  p1.type == p2.type && p1.formula == p2.formula &&
    equalActionSets(p1.actionSets, p2.actionSets)
  return res
}

export function getMaximalPlanValue(
  planProperties: Record<string, PlanProperty>
): number {
  let sum = 0;
  Object.values(planProperties).forEach((pp, key) => {
    sum += pp.utility;
  });
  return sum;
}
