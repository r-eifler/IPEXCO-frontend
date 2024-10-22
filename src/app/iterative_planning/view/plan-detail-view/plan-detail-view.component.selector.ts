import { createSelector } from "@ngrx/store";
import { selectIterativePlanningProperties, selectIterativePlanningSelectedStep } from "../../state/iterative-planning.selector";

const selectEnforcedGoalIds = createSelector(selectIterativePlanningSelectedStep, (step) => step?.hardGoals ?? []);
export const selectEnforcedGoals = createSelector(selectEnforcedGoalIds, selectIterativePlanningProperties,
  (goalIds, planningProperties) => goalIds.map(id => planningProperties?.[id]),
);

const selectSoftGoalIds = createSelector(selectIterativePlanningSelectedStep, (step) => step?.softGoals ?? []);

export const selectPlan = createSelector(selectIterativePlanningSelectedStep, (step) => step?.plan);
export const selectSolvedPropertyIds = createSelector(selectPlan, (plan) => plan?.satisfied_properties ?? []);

const selectSatisfiedSoftGoalIds = createSelector(selectSoftGoalIds, selectSolvedPropertyIds, (softGoalIds, solvedIds) => softGoalIds.filter(id => solvedIds.includes(id)));
const selectUnsatisfiedSoftGoalIds = createSelector(selectSoftGoalIds, selectSolvedPropertyIds, (softGoalIds, solvedIds) => softGoalIds.filter(id => !solvedIds.includes(id)));

export const selectSatisfiedSoftGoals = createSelector(selectSatisfiedSoftGoalIds, selectIterativePlanningProperties, (satisfiedIds, properties) => satisfiedIds.map(id => properties?.[id]));
export const selectUnsatisfiedSoftGoals = createSelector(selectUnsatisfiedSoftGoalIds, selectIterativePlanningProperties, (unsatisfiedIds, properties) => unsatisfiedIds.map(id => properties?.[id]));
