import { createFeatureSelector, createSelector } from '@ngrx/store';
import {userStudyExecutionFeature, UserStudyExecutionState} from './user-study-execution.reducer';

const selectUserStudyExecutionFeature = createFeatureSelector<UserStudyExecutionState>(userStudyExecutionFeature);

export const selectExecutionUserStudy = createSelector(selectUserStudyExecutionFeature, (state) => state.userStudy?.data)

export const selectExecutionUserStudyStepIndex = createSelector(selectUserStudyExecutionFeature, (state) => state.stepIndex)
export const selectExecutionUserStudyNextStepIndex = createSelector(selectUserStudyExecutionFeature, (state): number | null =>
    state.stepIndex  < state.userStudy.data?.steps.length ? state.stepIndex : null)

export const selectExecutionUserStudyStep = createSelector(selectUserStudyExecutionFeature, (state) =>
    state.stepIndex === null || state.stepIndex < state.userStudy.data?.steps.length ? state.userStudy?.data?.steps[state.stepIndex] : null)

export const selectExecutionUserStudyFinishedAllSteps = createSelector(selectUserStudyExecutionFeature, (state) => state.finishedAllSteps)
export const selectExecutionUserStudyCanceled = createSelector(selectUserStudyExecutionFeature, (state) => state.canceled)
