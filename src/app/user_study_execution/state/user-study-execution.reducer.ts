import { createReducer, on } from '@ngrx/store';
import { Loadable, LoadingState } from 'src/app/shared/common/loadable.interface';
import {UserStudy} from '../../user_study/domain/user-study';
import {
  executionFinishedLastUserStudyStep,
    executionLoadUserStudy,
    executionLoadUserStudySuccess,
    executionNextUserStudyStep,
    executionUserStudyCancelSuccess, executionUserStudySubmitSuccess,
    registerUserStudyUserSuccess
} from './user-study-execution.actions';

export interface UserStudyExecutionState {
    userStudy: Loadable<UserStudy>;
    stepIndex: number | null;
    canceled: boolean;
    finishedAllSteps: boolean 
}

export const userStudyExecutionFeature = 'user-study-execution';

const initialState: UserStudyExecutionState = {
    userStudy: {state: LoadingState.Initial, data: undefined},
    stepIndex: null,
    canceled: false,
    finishedAllSteps: false,
}


function executionUserStudyCanceltSuccess() {

}

export const userStudyExecutionReducer = createReducer(
    initialState,
    on(executionLoadUserStudy, (state): UserStudyExecutionState => ({
      ...state,
      userStudy: {state: LoadingState.Loading, data: undefined},
    })),
    on(executionLoadUserStudySuccess, (state, {userStudy}): UserStudyExecutionState => ({
      ...state,
      userStudy: {state: LoadingState.Done, data: userStudy},
    })),
    on(registerUserStudyUserSuccess, (state): UserStudyExecutionState => ({
      ...state,
      stepIndex: 0,
    })),
    on(executionNextUserStudyStep, (state): UserStudyExecutionState => ({
      ...state,
      stepIndex: state.stepIndex < state.userStudy.data?.steps.length - 1 ? state.stepIndex + 1 : null,
      finishedAllSteps: state.stepIndex == state.userStudy.data?.steps.length - 1
    })),
    on(executionFinishedLastUserStudyStep, (state): UserStudyExecutionState => ({
      ...state,
      stepIndex: null
  })),
    on(executionUserStudySubmitSuccess, (state): UserStudyExecutionState => ({
        ...state,
        stepIndex: null
    })),
    on(executionUserStudyCancelSuccess, (state): UserStudyExecutionState => ({
        ...state,
        stepIndex: null,
        canceled: true
    }))
  );
