import { createFeatureSelector, createSelector } from '@ngrx/store';
import {userStudyFeature, UserStudyState} from './user-study.reducer';
import {memoizeWith} from 'ramda';
import {selectProjectDemoProperties} from '../../project/state/project.selector';


const selectUserStudyFeature = createFeatureSelector<UserStudyState>(userStudyFeature);

export const selectUserStudies = createSelector(selectUserStudyFeature, (state) => state.userStudies?.data)

export const selectUserStudyParticipants = createSelector(selectUserStudyFeature, (state) => state.participants)
export const selectUserStudyParticipantsOfStudy = createSelector(selectUserStudyFeature, (state) =>
    state.userStudy !== undefined ? state.participants?.[state.userStudy.data?._id] :  null)
export const selectPlanPropertiesOfParticipantsById = memoizeWith(
    (studyId: string) => studyId,
    (studyId: string) => createSelector(selectUserStudyParticipants, (participants) => participants[studyId]),
    );

export const selectUserStudyDemos = createSelector(selectUserStudyFeature, (state) => state.demos.data)

export const selectUserStudy = createSelector(selectUserStudyFeature, (state) => state.userStudy?.data)
