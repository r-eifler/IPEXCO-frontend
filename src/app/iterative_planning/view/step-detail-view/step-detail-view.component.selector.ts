import { createSelector } from "@ngrx/store";
import { selectIterativePlanningProperties, selectIterativePlanningPropertiesList, selectIterativePlanningSelectedStep } from "../../state/iterative-planning.selector";

const selectEnforcedGoalIds = createSelector(selectIterativePlanningSelectedStep, (step) => step?.hardGoals ?? []);
export const selectEnforcedGoals = createSelector(selectEnforcedGoalIds, selectIterativePlanningProperties,
  (goalIds, planningProperties) => goalIds.map(id => planningProperties?.[id]),
);

const selectSoftGoalIds = createSelector(selectIterativePlanningSelectedStep, (step) => step?.softGoals ?? []);
export const selectSoftGoals = createSelector(selectSoftGoalIds, selectIterativePlanningProperties,
  (goalIds, planningProperties) => goalIds.map(id => planningProperties?.[id]),
);

const selectAllPropertyIds = createSelector(selectIterativePlanningPropertiesList, (properties) => properties?.map(({_id}) => _id) ?? []);
const selectSolvedPropertyIds = createSelector(selectEnforcedGoalIds, selectSoftGoalIds, (enforcedGoalIds, softGoalIds) => [...enforcedGoalIds, ...softGoalIds]);
const selectUnsolvablePropertyIds = createSelector(selectAllPropertyIds, selectSolvedPropertyIds, (allIds, solvedIds) => allIds.filter(id => !solvedIds.includes(id)));
export const selectUnsolvableProperties = createSelector(selectUnsolvablePropertyIds, selectIterativePlanningProperties, (unsolvableIds, planningProperties) => unsolvableIds.map(id => planningProperties?.[id]));
