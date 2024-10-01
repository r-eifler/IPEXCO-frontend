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

export enum GoalType {
  goalFact = "G",
  LTL = "LTL",
  AS = "AS",
}

export interface PlanProperty {
  _id?: string;
  name: string;
  type: GoalType;
  naturalLanguage?: string;
  formula: string;
  actionSets?: ActionSet[];
  naturalLanguageDescription?: string;
  project: string;
  isUsed: boolean;
  globalHardGoal: boolean;
  utility: number;
  color: string;
  icon: string;
  class: string;
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
