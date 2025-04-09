import { createReducer, on } from '@ngrx/store';
import { Loadable, LoadingState } from 'src/app/shared/common/loadable.interface';
import { Creatable, CreationState } from 'src/app/shared/common/creatable.interface';
import { UserStudy } from '../domain/user-study';
import {
  editUserStudy, editUserStudySuccess,
  loadParticipantDistribution,
  loadParticipantDistributions,
  loadParticipantDistributionsSuccess,
  loadParticipantDistributionSuccess,
  loadUserStudies,
  loadUserStudiesSuccess,
  loadUserStudy,
  loadUserStudyDemos,
  loadUserStudyDemosSuccess, loadUserStudyParticipantsSuccess,
  loadUserStudySuccess
} from './user-study.actions';
import {UserStudyExecution} from '../domain/user-study-execution';
import { ParticipantDistribution } from '../domain/participant-distribution';
import { Demo } from 'src/app/shared/domain/demo';

export interface UserStudyState {
    userStudies: Loadable<UserStudy[]>;
    participants: Record<string, UserStudyExecution[]>;
    createdUserStudy: Creatable<UserStudy>;
    demos: Loadable<Demo[]>;
    userStudy: Loadable<UserStudy>;
    participantDistributions: Loadable<ParticipantDistribution[]>;
    participantDistribution: Loadable<ParticipantDistribution>;
}


const initialState: UserStudyState = {
    userStudies: {state: LoadingState.Initial, data: undefined},
    participants: {},
    createdUserStudy: {state: CreationState.Default, data: undefined},
    demos: {state: LoadingState.Initial, data: undefined},
    userStudy: {state: LoadingState.Initial, data: undefined},
    participantDistributions:  {state: LoadingState.Initial, data: undefined},
    participantDistribution:  {state: LoadingState.Initial, data: undefined},
}


export const userStudyReducer = createReducer(
    initialState,
    on(loadUserStudies, (state): UserStudyState => ({
        ...state,
        userStudies: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadUserStudiesSuccess, (state, {userStudies}): UserStudyState => ({
        ...state,
        userStudies: {state: LoadingState.Done, data: userStudies},
    })),
    on(loadUserStudyDemos, (state): UserStudyState => ({
      ...state,
      demos: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadUserStudyDemosSuccess, (state, {demos}): UserStudyState => ({
      ...state,
      demos: {state: LoadingState.Done, data: demos},
    })),
    on(loadUserStudyParticipantsSuccess, (state, {userStudyId, participants}): UserStudyState => ({
      ...state,
      participants: {...state.participants, [userStudyId]: participants},
    })),
    on(loadUserStudy, (state): UserStudyState => ({
      ...state,
      userStudy: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadUserStudySuccess, (state, {userStudy}): UserStudyState => ({
      ...state,
      userStudy: {state: LoadingState.Done, data: userStudy},
    })),
    on(editUserStudy, (state): UserStudyState => ({
      ...state,
      userStudy: {state: LoadingState.Loading, data: undefined}
    })),
    on(editUserStudySuccess, (state, {userStudy}): UserStudyState => ({
      ...state,
      userStudy: {state: LoadingState.Done, data: userStudy},
    })),
    on(loadParticipantDistributions, (state): UserStudyState => ({
      ...state,
      participantDistributions: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadParticipantDistributionsSuccess, (state, {distributions}): UserStudyState => ({
        ...state,
        participantDistributions: {state: LoadingState.Done, data: distributions},
    })),
    on(loadParticipantDistribution, (state): UserStudyState => ({
      ...state,
      participantDistribution: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadParticipantDistributionSuccess, (state, {distribution}): UserStudyState => ({
      ...state,
      participantDistribution: {state: LoadingState.Done, data: distribution},
    })),
);
