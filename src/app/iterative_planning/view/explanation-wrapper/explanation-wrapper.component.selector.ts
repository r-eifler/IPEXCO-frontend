import {createSelector} from '@ngrx/store';
import {selectIterativePlanningProperties, selectIterativePlanningSelectedStep} from '../../state/iterative-planning.selector';
import {selectSolvedPropertyIds} from '../step-detail-view/step-detail-view.component.selector';

const selectSoftGoalIds = createSelector(selectIterativePlanningSelectedStep, (step) => step?.softGoals ?? []);
const selectUnsatisfiedSoftGoalIds = createSelector(selectSoftGoalIds, selectSolvedPropertyIds, (softGoalIds, solvedIds) => softGoalIds.filter(id => !solvedIds.includes(id)));

export const selectUnsatisfiedSoftGoals = createSelector(selectUnsatisfiedSoftGoalIds, selectIterativePlanningProperties, (unsatisfiedIds, properties) => unsatisfiedIds.map(id => properties?.[id]));
