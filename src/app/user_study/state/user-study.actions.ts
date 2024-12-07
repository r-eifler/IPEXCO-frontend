import { createAction, props } from "@ngrx/store";
import { Demo } from "src/app/demo/domain/demo";
import { UserStudy } from "../domain/user-study";

// User Studies

export const loadUserStudies = createAction('[UserStudy] load user studies');
export const loadUserStudiesSuccess = createAction('[UserStudy] load user studies success', props<{userStudies: UserStudy[]}>());
export const loadUserStudiesFailure = createAction('[UserStudy] load user studies failure');

export const createUserStudy = createAction('[UserStudy] create user study', props<{userStudy: UserStudy}>());
export const createUserStudySuccess = createAction('[UserStudy] create user study success', props<{userStudy: UserStudy}>());
export const createUserStudyFailure = createAction('[UserStudy] create user study failure');

export const loadUserStudy = createAction('[UserStudy] load user study', props<{id: string}>());
export const loadUserStudySuccess = createAction('[UserStudy] load user study success', props<{userStudy: UserStudy}>());
export const loadUserStudyFailure = createAction('[UserStudy] load user study failure');

export const updateUserStudy = createAction('[UserStudy] update user study', props<{userStudy: UserStudy}>());
export const updateUserStudySuccess = createAction('[UserStudy] update user study success', props<{userStudy: UserStudy}>());
export const updateUserStudyFailure = createAction('[UserStudy] update user study failure');

export const deleteUserStudy = createAction('[UserStudy] delete user study', props<{id: string}>());
export const deleteUserStudySuccess = createAction('[UserStudy] delete user study success');
export const deleteUserStudyFailure = createAction('[UserStudy] delete user study failure');

// Demos

export const loadUserStudyDemos = createAction('[UserStudy] load user study demos');
export const loadUserStudyDemosSuccess = createAction('[UserStudy] load user study demos success', props<{demos: Demo[]}>());
export const loadUserStudyDemosFailure = createAction('[UserStudy] load user study demos failure');
