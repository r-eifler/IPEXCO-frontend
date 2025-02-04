import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserStudyExecutionState} from './user-study-execution.reducer';
import { userStudyExecutionFeature } from './user-study-execution.feature';

const selectState = userStudyExecutionFeature.selectUserStudyExecutionFeatureState;


export const selectExecutionUserStudy = createSelector(selectState, (state) => state.userStudy?.data)

export const selectExecutionUserStudyStepIndex = createSelector(selectState, (state) => state.stepIndex)
export const selectExecutionUserStudyNextStepIndex = createSelector(selectState, (state): number | null =>
    state.stepIndex  < state.userStudy.data?.steps.length ? state.stepIndex : null)

export const selectExecutionUserStudyStep = createSelector(selectState, (state) =>
    state.stepIndex !== null && state.stepIndex < state.userStudy.data?.steps.length ? state.userStudy?.data?.steps[state.stepIndex] : null)

export const selectExecutionUserStudyFinishedAllSteps = createSelector(selectState, (state) => state.finishedAllSteps)
export const selectExecutionUserStudyCanceled = createSelector(selectState, (state) => state.canceled)


// Demo
export const selectExecutionUserStudyDemo = createSelector(selectState, (state) => state.runningDemo?.data)
export const selectExecutionUserStudyPlanProperties = createSelector(selectState, (state) => state.runningDemoPlanProperties?.data)

// For logging

export const selectExecutionUserStudyPendingIterationSteps = createSelector(selectState, (state) => state.pendingIterationSteps)
