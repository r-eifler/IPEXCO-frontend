import { createReducer, on } from '@ngrx/store';
import { Loadable, LoadingState } from 'src/app/shared/common/loadable.interface';
import {UserStudy} from '../../user_study/domain/user-study';
import {executionLoadUserStudy, executionLoadUserStudySuccess, executionSelectUserStudyStep} from './user-study-execution.actions';

export interface UserStudyExecutionState {
    userStudy: Loadable<UserStudy>;
    stepIndex: number | null;
}

export const userStudyExecutionFeature = 'user-study-execution';

const initialState: UserStudyExecutionState = {
    userStudy: {state: LoadingState.Initial, data: undefined},
  stepIndex: null
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
    on(executionSelectUserStudyStep, (state, {index}): UserStudyExecutionState => ({
      ...state,
      stepIndex: index
    }))
  );
