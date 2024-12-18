import { createAction, props } from "@ngrx/store";
import { Demo } from "src/app/demo/domain/demo";
import { UserStudy } from "../domain/user-study";
import {UserStudyExecution} from '../domain/user-study-execution';
import { ParticipantDistribution } from "../domain/participant-distribution";

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

export const editUserStudy = createAction('[UserStudy] edit user study', props<{userStudy: UserStudy}>());
export const editUserStudySuccess = createAction('[UserStudy] edit user study success', props<{userStudy: UserStudy}>());
export const editUserStudyFailure = createAction('[UserStudy] edit user study failure');

export const deleteUserStudy = createAction('[UserStudy] delete user study', props<{id: string}>());
export const deleteUserStudySuccess = createAction('[UserStudy] delete user study success');
export const deleteUserStudyFailure = createAction('[UserStudy] delete user study failure');


// participants
export const loadUserStudyParticipants = createAction('[UserStudy] load user study participants', props<{id: string}>());
export const loadUserStudyParticipantsSuccess = createAction('[UserStudy] load user study participants success', props<{userStudyId: string,participants: UserStudyExecution[]}>());
export const loadUserStudyParticipantsFailure = createAction('[UserStudy] load user study participants failure');

export const acceptUserStudyParticipant = createAction('[UserStudy] accept user study participant', props<{userId: string}>());
export const acceptUserStudyParticipantSuccess = createAction('[UserStudy] accept user study participant success');
export const acceptUserStudyParticipantFailure = createAction('[UserStudy] accept user study participant failure');

// Demos

export const loadUserStudyDemos = createAction('[UserStudy] load user study demos');
export const loadUserStudyDemosSuccess = createAction('[UserStudy] load user study demos success', props<{demos: Demo[]}>());
export const loadUserStudyDemosFailure = createAction('[UserStudy] load user study demos failure');


// User Studies Participant Distribution

export const loadParticipantDistributions = createAction('[UserStudy] load user study participant distributions');
export const loadParticipantDistributionsSuccess = createAction('[UserStudy] load user study participant distributions success', props<{distributions: ParticipantDistribution[]}>());
export const loadParticipantDistributionsFailure = createAction('[UserStudy] load user study participant distributions failure');

export const createParticipantDistribution = createAction('[UserStudy] create user study participant distribution', props<{distribution: ParticipantDistribution}>());
export const createParticipantDistributionSuccess = createAction('[UserStudy] create user study participant distribution success', props<{distribution: ParticipantDistribution}>());
export const createParticipantDistributionFailure = createAction('[UserStudy] create user study participant distribution failure');

export const loadParticipantDistribution= createAction('[UserStudy] load user study participant distribution', props<{id: string}>());
export const loadParticipantDistributionSuccess = createAction('[UserStudy] load user study participant distribution success', props<{distribution: ParticipantDistribution}>());
export const loadParticipantDistributionFailure = createAction('[UserStudy] load user study participant distribution failure');

export const editParticipantDistribution= createAction('[UserStudy] edit user study participant distribution', props<{distribution: ParticipantDistribution}>());
export const editParticipantDistributionSuccess = createAction('[UserStudy] edit user study participant distribution success', props<{distribution: ParticipantDistribution}>());
export const editParticipantDistributionFailure = createAction('[UserStudy] edit user study participant distribution failure');

export const deleteParticipantDistribution = createAction('[UserStudy] delete user study participant distribution', props<{id: string}>());
export const deleteParticipantDistributionSuccess = createAction('[UserStudy] delete user study participant distribution success');
export const deleteParticipantDistributionFailure = createAction('[UserStudy] delete user study participant distribution failure');