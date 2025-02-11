import { createSelector } from '@ngrx/store';
import { memoizeWith } from 'ramda';
import { userStudyFeature } from './user-study.feature';


const selectState = userStudyFeature.selectUserStudyFeatureState;


export const selectUserStudies = createSelector(selectState, (state) => state.userStudies?.data)

export const selectUserStudyParticipants = createSelector(selectState, (state) => state.participants)
export const selectUserStudyParticipantsOfStudy = createSelector(selectState, (state) =>
    state.userStudy !== undefined ? state.participants?.[state.userStudy.data?._id] :  null)
export const selectPlanPropertiesOfParticipantsById = memoizeWith(
    (studyId: string) => studyId,
    (studyId: string) => createSelector(selectUserStudyParticipants, (participants) => participants[studyId]),
);

export const selectUserStudyDemos = createSelector(selectState, (state) => state.demos.data)

export const selectUserStudy = createSelector(selectState, (state) => state.userStudy?.data)

export const selectUserStudyParticipantDistributions = createSelector(selectState, (state) => state.participantDistributions?.data)
export const selectUserStudyParticipantDistribution = createSelector(selectState, (state) => state.participantDistribution?.data)