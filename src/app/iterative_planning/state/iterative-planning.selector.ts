import { createFeatureSelector, createSelector } from "@ngrx/store";
import { iterativePlanningFeature, IterativePlanningState } from "./iterative-planning.reducer";
import { LoadingState } from "src/app/shared/common/loadable.interface";


const selectIterativePlanningFeature = createFeatureSelector<IterativePlanningState>(iterativePlanningFeature);

export const selectIterativePlanningProject = createSelector(selectIterativePlanningFeature, 
    (state) => state.project?.data)
export const selectIterativePlanningProperties = createSelector(selectIterativePlanningFeature, 
    (state) => state.planProperties?.data)
export const selectIterativePlanningPropertiesList = createSelector(selectIterativePlanningFeature, 
    (state) => state.planProperties.state == LoadingState.Done ? Object.values(state.planProperties?.data) : null)



export const selectIterativePlanningIterationSteps = createSelector(selectIterativePlanningFeature, 
    (state) => state.iterationSteps.data)

export const selectIterativePlanningNewStep = createSelector(selectIterativePlanningFeature, 
    (state) => state.newStep)

export const selectIterativePlanningSelectedStep = createSelector(selectIterativePlanningFeature, 
    (state) => state.selectedIterationStep)

export const selectIterativePlanningNumStep = createSelector(selectIterativePlanningFeature, 
    (state) => state.iterationSteps?.data.length)
