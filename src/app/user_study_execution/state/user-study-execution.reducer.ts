import { createReducer, on } from '@ngrx/store';
import { Loadable, LoadingState } from 'src/app/shared/common/loadable.interface';
import {UserStudy} from '../../user_study/domain/user-study';
import {
  executionFinishedLastUserStudyStep,
    executionLoadUserStudy,
    executionLoadUserStudySuccess,
    executionNextUserStudyStep,
    executionUserStudyCancelSuccess, executionUserStudyStart, executionUserStudySubmitSuccess,
    loadUserStudyDemo,
    loadUserStudyDemoSuccess,
    loadUserStudyPlanProperties,
    loadUserStudyPlanPropertiesSuccess,
    logAction,
    logPlanComputationFinished,
    registerUserStudyUserSuccess
} from './user-study-execution.actions';
import { createIterationStepSuccess } from 'src/app/iterative_planning/state/iterative-planning.actions';
import { UserAction } from '../domain/user-action';
import { Demo } from 'src/app/shared/domain/demo';
import { PlanProperty } from 'src/app/shared/domain/plan-property/plan-property';
import { isNil } from 'ramda';

export interface UserStudyExecutionState {
    userStudy: Loadable<UserStudy>;
    stepIndex: number | null;
    pendingIterationSteps: string[];
    canceled: boolean;
    finishedAllSteps: boolean 
    actionLog: UserAction[];
    runningDemo: Loadable<Demo>;
    runningDemoPlanProperties: Loadable<PlanProperty[]>;
}


const initialState: UserStudyExecutionState = {
    userStudy: {state: LoadingState.Initial, data: undefined},
    stepIndex: null,
    pendingIterationSteps: [],
    canceled: false,
    finishedAllSteps: false,
    actionLog: [],
    runningDemo: {state: LoadingState.Initial, data: undefined},
    runningDemoPlanProperties: {state: LoadingState.Initial, data: undefined},
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
      stepIndex: state.stepIndex !== null && state.stepIndex !== undefined && 
      state.userStudy.data?.steps !== null  && state.userStudy.data?.steps !== undefined && 
      state.stepIndex < state.userStudy.data?.steps.length - 1 ? 
        state.stepIndex + 1 : 
        null,
      finishedAllSteps: !!state.userStudy.data?.steps && !!state.stepIndex && (state.stepIndex == state.userStudy.data?.steps.length - 1),
    })),
    on(loadUserStudyDemo, (state): UserStudyExecutionState => ({
      ...state,
      runningDemo: {state: LoadingState.Loading, data: undefined},
      runningDemoPlanProperties: {state: LoadingState.Initial, data: undefined},
    })),
    on(loadUserStudyDemoSuccess, (state, {demo}): UserStudyExecutionState => ({
      ...state,
      runningDemo: {state: LoadingState.Done, data: demo}
    })),
    on(loadUserStudyPlanProperties, (state): UserStudyExecutionState => ({
      ...state,
      runningDemoPlanProperties: {state: LoadingState.Initial, data: undefined},
    })),
    on(loadUserStudyPlanPropertiesSuccess, (state, {planProperties}): UserStudyExecutionState => ({
      ...state,
      runningDemoPlanProperties: {state: LoadingState.Done, data: planProperties}
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
      pendingIterationSteps: [...state.pendingIterationSteps].concat(iterationStep._id ? [iterationStep._id] : [])
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
