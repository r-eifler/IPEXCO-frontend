import {createSelector} from '@ngrx/store';
import {selectIterativePlanningProperties, selectIterativePlanningSelectedStep} from '../../../state/iterative-planning.selector';

const selectSoftGoalIds = createSelector(selectIterativePlanningSelectedStep, (step) => step?.softGoals ?? []);
export const selectSoftGoals = createSelector(selectSoftGoalIds, selectIterativePlanningProperties,
  (goalIds, planningProperties) => goalIds.map(id => planningProperties?.[id]),
);
