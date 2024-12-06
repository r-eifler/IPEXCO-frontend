import { createReducer, on } from '@ngrx/store';
import { Loadable, LoadingState } from 'src/app/shared/common/loadable.interface';
import { Creatable, CreationState } from 'src/app/shared/common/creatable.interface';
import { UserStudy } from '../domain/user-study';
import { Demo } from 'src/app/demo/domain/demo';
import {loadUserStudies, loadUserStudiesSuccess, loadUserStudyDemos, loadUserStudyDemosSuccess} from './user-study.actions';

export interface UserStudyState {
    userStudies: Loadable<UserStudy[]>;
    createdUserStudy: Creatable<UserStudy>;
    demos: Loadable<Demo[]>;
}

export const userStudyFeature = 'user-study';

const initialState: UserStudyState = {
    userStudies: {state: LoadingState.Initial, data: undefined},
    createdUserStudy: {state: CreationState.Default, data: undefined},
    demos: {state: LoadingState.Initial, data: undefined},
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
);
