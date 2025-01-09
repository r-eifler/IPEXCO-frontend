import { createSelector } from "@ngrx/store";

import { selectIterativePlanningNewStepBase, selectIterativePlanningPropertiesList } from "../../state/iterative-planning.selector";

export const selectPlanPropertyIds = createSelector(selectIterativePlanningPropertiesList, properties => properties?.map(({_id}) => _id) ?? []);

export const selectGlobalHardGoalPlanPropertyIds = createSelector(selectIterativePlanningPropertiesList, properties => properties?.filter(pp => pp.globalHardGoal).map(({_id}) => _id) ?? []);

export const selectPreselectedEnforcedGoals$ = createSelector(selectGlobalHardGoalPlanPropertyIds, selectIterativePlanningNewStepBase, 
    (globalHardIds, baseStep) => baseStep?.hardGoals ? [...globalHardIds,...baseStep.hardGoals.filter(pId => !globalHardIds.includes(pId))] : globalHardIds);


export const selectPreselectedSoftGoals$ = createSelector(selectIterativePlanningNewStepBase, step => step?.softGoals ?? []);
