import { createFeatureSelector, createSelector } from "@ngrx/store";
import { iterativePlanningFeature, IterativePlanningState } from "./iterative-planning.reducer";


const selectIterativePlanningFeature = createFeatureSelector<IterativePlanningState>(iterativePlanningFeature);

export const selectIterativePlanningProject = createSelector(selectIterativePlanningFeature, (state) => state.project?.data)
export const selectIterativePlanningProperties = createSelector(selectIterativePlanningFeature, (state) => state.planProperties?.data)
