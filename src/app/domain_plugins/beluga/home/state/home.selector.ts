import { createSelector } from "@ngrx/store";
import { HomeFeature } from "./home.feature";


const selectState = HomeFeature.selectHomeFeatureState

export const selectProjects = createSelector(selectState, (state) => state.projects.data)

export const selectDomainSpecifications = createSelector(selectState, 
    (state) => state.domainSpecifications.data)

export const selectProject = createSelector(selectState, 
    (state) => (state.project.data))