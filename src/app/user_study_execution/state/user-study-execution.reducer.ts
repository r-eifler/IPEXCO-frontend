import { createReducer, on } from '@ngrx/store';
import { Loadable, LoadingState } from 'src/app/shared/common/loadable.interface';
import {UserStudy} from '../../user_study/domain/user-study';
import {
  executionFinishedLastUserStudyStep,
    executionLoadUserStudy,
    executionLoadUserStudySuccess,
    executionNextUserStudyStep,
    executionUserStudyCancelSuccess, executionUserStudyStart, executionUserStudySubmitSuccess,
    logAction,
    logPlanComputationFinished,
    registerUserStudyUserSuccess
} from './user-study-execution.actions';
import { createIterationStepSuccess } from 'src/app/iterative_planning/state/iterative-planning.actions';
import { UserAction } from '../domain/user-action';

export interface UserStudyExecutionState {
    userStudy: Loadable<UserStudy>;
    stepIndex: number | null;
    pendingIterationSteps: string[];
    canceled: boolean;
    finishedAllSteps: boolean 
    actionLog: UserAction[];
}

export const userStudyExecutionFeature = 'user-study-execution';

const initialState: UserStudyExecutionState = {
    userStudy: {state: LoadingState.Initial, data: undefined},
    stepIndex: null,
    pendingIterationSteps: [],
    canceled: false,
    finishedAllSteps: false,
    actionLog: [],
}


export const userStudyExecutionReducer = createReducer(
    initialState,
    on(executionLoadUserStudy, (state): UserStudyExecutionState => ({
      ...state,
      userStudy: {state: LoadingState.Loading, data: undefined},
      stepIndex: null,
      pendingIterationSteps: [],
      canceled: false,
      finishedAllSteps: false,
      actionLog: []
    })),
    on(executionLoadUserStudySuccess, (state, {userStudy}): UserStudyExecutionState => ({
      ...state,
      userStudy: {state: LoadingState.Done, data: userStudy},
    })),
    on(executionUserStudyStart, (state): UserStudyExecutionState => ({
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
    })),
    on(createIterationStepSuccess, (state, {iterationStep}): UserStudyExecutionState =>({
      ... state,
      pendingIterationSteps: [...state.pendingIterationSteps, iterationStep._id]
    })),
    on(logPlanComputationFinished, (state, {iterationStepId}): UserStudyExecutionState => ({
      ...state,
      pendingIterationSteps: [...state.pendingIterationSteps].filter(id => id != iterationStepId)
    })),
    on(logAction, (state, {action}): UserStudyExecutionState => ({
      ...state,
      actionLog: [...state.actionLog, action]
    })),
  );
