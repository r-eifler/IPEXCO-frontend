import { createAction, props } from '@ngrx/store';
import {UserStudy} from '../../user_study/domain/user-study';

// User Studies

export const executionLoadUserStudy = createAction('[UserStudyExecution] load user study', props<{id: string}>());
export const executionLoadUserStudySuccess = createAction('[UserStudyExecution] load user study success', props<{userStudy: UserStudy}>());
export const executionLoadUserStudyFailure = createAction('[UserStudyExecution] load user study failure');

