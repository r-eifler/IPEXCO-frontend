import { createAction, props } from '@ngrx/store';
import {UserStudy} from '../../user_study/domain/user-study';
import {User} from '../../user/domain/user';

// User Studies
export const executionLoadUserStudy = createAction('[UserStudyExecution] load user study', props<{id: string}>());
export const executionLoadUserStudySuccess = createAction('[UserStudyExecution] load user study success', props<{userStudy: UserStudy}>());
export const executionLoadUserStudyFailure = createAction('[UserStudyExecution] load user study failure');


// steps
export const executionSelectUserStudyStep = createAction('[UserStudyExecution] select user study step', props<{index: number}>());
export const executionNextUserStudyStep = createAction('[UserStudyExecution] next user study step');


// execution
export const executionUserStudyFail = createAction('[UserStudyExecution] fail');

export const executionUserStudySubmit = createAction('[UserStudyExecution] submit');
export const executionUserStudySubmitSuccess = createAction('[UserStudyExecution] submit success');
export const executionUserStudySubmitFailure = createAction('[UserStudyExecution] submit failure');

export const executionUserStudyCancel = createAction('[UserStudyExecution] cancel');
export const executionUserStudyCancelSuccess = createAction('[UserStudyExecution] cancel success');
export const executionUserStudyCancelFailure = createAction('[UserStudyExecution] cancel failure');


// user
export const registerUserStudyUser = createAction('[UserStudyExecution] register user study user', props<{id: string}>());
export const registerUserStudyUserSuccess = createAction('[UserStudyExecution] register user study user success', props<{user: User, token: string}>());
export const registerUserStudyUserFailure = createAction('[UserStudyExecution] register user study user failure');
