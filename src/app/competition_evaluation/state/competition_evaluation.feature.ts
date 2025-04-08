import { createFeature } from "@ngrx/store";
import { competitionEvaluationReducer } from "./competition_evaluation.reduce";


export const competitionEvaluationFeature = createFeature({
    name: 'competitionEvaluationFeature',
    reducer: competitionEvaluationReducer
});

export const {
    name,
    reducer,
    selectCompetitionEvaluationFeatureState,
    selectEvaluationInstances,
    selectSelectedId
  } = competitionEvaluationFeature;