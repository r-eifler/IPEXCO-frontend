import { createSelector } from "@ngrx/store";

import { selectIterativePlanningNewStep, selectIterativePlanningPropertiesList } from "../../state/iterative-planning.selector";

export const selectPlanPropertyIds = createSelector(selectIterativePlanningPropertiesList, properties => properties?.map(({_id}) => _id) ?? []);
export const selectPreselectedEnforcedGoals$ = createSelector(selectIterativePlanningNewStep, newStep => newStep?.hardGoals ?? []);
export const selectPreselectedSoftGoals$ = createSelector(selectIterativePlanningNewStep, newStep => newStep?.softGoals ?? []);
