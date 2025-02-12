export interface Action {
  _id?: string;
  name: string;
  params: string[];
}

export function toAction(as: string): Action {
  const [name, ...params] = as.split(" ");
  return { name, params };
}

export interface ActionSet {
  _id?: string;
  name: string;
  actions: Action[];
}

export function equalActionSets(a1: ActionSet[], a2: ActionSet[]): boolean {
  // TODO
  return false;
}

export enum GoalType {
  goalFact = "G",
  LTL = "LTL",
  AS = "AS",
  DOMAIN_DEPENDENT = "DOMAIN_DEPENDENT",
}

export interface PlanPropertyDefinition {
  name: string;
  parameters: string[]
}

export interface PlanProperty {
  _id?: string;
  project: string;
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

export function equalPlanProperties(p1: PlanProperty, p2: PlanProperty): boolean {
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
