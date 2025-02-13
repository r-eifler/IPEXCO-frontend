import { createAction, props } from '@ngrx/store';
import {UserStudy} from '../../user_study/domain/user-study';
import {User} from '../../user/domain/user';
import { UserAction } from '../domain/user-action';
import { PlanProperty } from 'src/app/shared/domain/plan-property/plan-property';
import { Demo } from 'src/app/shared/domain/demo';

// User Studies
export const executionLoadUserStudy = createAction('[UserStudyExecution] load user study', props<{id: string}>());
export const executionLoadUserStudySuccess = createAction('[UserStudyExecution] load user study success', props<{userStudy: UserStudy}>());
export const executionLoadUserStudyFailure = createAction('[UserStudyExecution] load user study failure');


// steps
export const executionNextUserStudyStep = createAction('[UserStudyExecution] next user study step');
export const executionFinishedLastUserStudyStep = createAction('[UserStudyExecution] finish last user study step');


// execution
export const executionUserStudyStart= createAction('[UserStudyExecution] start');
export const executionUserStudyFail = createAction('[UserStudyExecution] fail');

export const executionUserStudySubmit = createAction('[UserStudyExecution] submit');
export const executionUserStudySubmitSuccess = createAction('[UserStudyExecution] submit success');
export const executionUserStudySubmitFailure = createAction('[UserStudyExecution] submit failure');

export const executionUserStudyCancel = createAction('[UserStudyExecution] cancel');
export const executionUserStudyCancelSuccess = createAction('[UserStudyExecution] cancel success');
export const executionUserStudyCancelFailure = createAction('[UserStudyExecution] cancel failure');

// demo 
export const loadUserStudyDemo = createAction('[UserStudyExecution] load user study demo', props<{demoId: string}>());
export const loadUserStudyDemoSuccess = createAction('[UserStudyExecution] load user study demo success', props<{demo: Demo}>());
export const loadUserStudyDemoFailure = createAction('[UserStudyExecution] load user study demo failure');


// planProperties 
export const loadUserStudyPlanProperties = createAction('[UserStudyExecution] load user study Plan Properties', props<{demoId: string}>());
export const loadUserStudyPlanPropertiesSuccess = createAction('[UserStudyExecution] load user study Plan Properties success', props<{planProperties: PlanProperty[]}>());
export const loadUserStudyPlanPropertiesFailure = createAction('[UserStudyExecution] load user study Plan Properties failure');


// user
export const registerUserStudyUser = createAction('[UserStudyExecution] register user study user', props<{id: string}>());
export const registerUserStudyUserSuccess = createAction('[UserStudyExecution] register user study user success', props<{user: User, token: string}>());
export const registerUserStudyUserFailure = createAction('[UserStudyExecution] register user study user failure');

// 
export const distributeParticipant = createAction('[UserStudyExecution] distribute participant', props<{distributionId: string}>());
export const distributeParticipantSuccess = createAction('[UserStudyExecution] distribute participant success');
export const distributeParticipantFailure = createAction('[UserStudyExecution] distribute participant failure');

// User action logging

export const logAction = createAction('[LOG] log action', props<{action: UserAction}>());
export const logActionSuccess = createAction('[LOG] log action success');
export const logActionFailure = createAction('[LOG] log action failure');

export const logPlanComputationFinished = createAction('[LOG] plan computation finished', props<{iterationStepId: string}>());