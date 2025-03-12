import { createFeature } from "@ngrx/store";
import { userStudyExecutionReducer } from "./user-study-execution.reducer";


export const userStudyExecutionFeature = createFeature({
    name: 'userStudyExecutionFeature',
    reducer: userStudyExecutionReducer
});

export const {
    name,
    reducer,
    selectUserStudyExecutionFeatureState,
    selectActionLog,
    selectCanceled,
    selectFinishedAllSteps,
    selectPendingIterationSteps,
    selectRunningDemo,
    selectRunningDemoPlanProperties,
    selectStepIndex,
    selectUserStudy
  } = userStudyExecutionFeature;