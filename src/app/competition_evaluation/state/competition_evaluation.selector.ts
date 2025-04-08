import { createSelector } from "@ngrx/store";
import { competitionEvaluationFeature } from "./competition_evaluation.feature";

const selectState = competitionEvaluationFeature.selectCompetitionEvaluationFeatureState


// plans

export const selectEvaluationInstances = createSelector(selectState, (state) => state.evaluationInstances.data);

export const selectSelectedInstance = createSelector(selectState, (state) => 
    state.selectedId === null || state?.evaluationInstances.data === undefined ? null : 
    state?.evaluationInstances.data.find(p => p._id === state.selectedId));

