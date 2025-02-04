import { createFeature } from "@ngrx/store";
import { userStudyReducer } from "./user-study.reducer";


export const userStudyFeature = createFeature({
    name: 'userStudyFeature',
    reducer: userStudyReducer
});

export const {
    name,
    reducer,
    selectUserStudyFeatureState,
    selectCreatedUserStudy,
    selectDemos,
    selectParticipantDistribution,
    selectParticipantDistributions,
    selectParticipants,
    selectUserStudies,
    selectUserStudy
  } = userStudyFeature;