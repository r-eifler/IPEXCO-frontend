import { createReducer, on } from '@ngrx/store';
import { Loadable, LoadingState } from 'src/app/shared/common/loadable.interface';
import { Creatable, CreationState } from 'src/app/shared/common/creatable.interface';
import { UserStudy } from '../domain/user-study';
import { Demo } from 'src/app/demo/domain/demo';
import {
  editUserStudy, editUserStudySuccess,
  loadUserStudies,
  loadUserStudiesSuccess,
  loadUserStudy,
  loadUserStudyDemos,
  loadUserStudyDemosSuccess, loadUserStudyParticipantsSuccess,
  loadUserStudySuccess
} from './user-study.actions';
import {UserStudyExecution} from '../domain/user-study-execution';

export interface UserStudyState {
    userStudies: Loadable<UserStudy[]>;
    participants: Record<string, UserStudyExecution[]>
    createdUserStudy: Creatable<UserStudy>;
    demos: Loadable<Demo[]>;
    userStudy: Loadable<UserStudy>;
}

export const userStudyFeature = 'user-study';

const initialState: UserStudyState = {
    userStudies: {state: LoadingState.Initial, data: undefined},
    participants: undefined,
    createdUserStudy: {state: CreationState.Default, data: undefined},
    demos: {state: LoadingState.Initial, data: undefined},
    userStudy: {state: LoadingState.Initial, data: undefined},
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
);
