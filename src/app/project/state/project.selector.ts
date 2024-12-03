import { createFeatureSelector, createSelector } from "@ngrx/store";
import { projectFeature, ProjectState } from "./project.reducer";


const selectProjectFeature = createFeatureSelector<ProjectState>(projectFeature);

export const selectProject = createSelector(selectProjectFeature, (state) => state.project.data)

export const selectProjectSettings = createSelector(selectProjectFeature, (state) => state.project.data?.settings)
export const selectProjectPlanningTask = createSelector(selectProjectFeature, (state) => state.project.data?.baseTask)

export const selectProjectPlanPropertyCreationInterfaceType = createSelector(selectProjectFeature,
    (state) => state.project?.data?.settings?.propertyCreationInterfaceType)
export const selectProjectPlanPropertyTemplates = createSelector(selectProjectFeature,
    (state) => state.project?.data?.domainSpecification?.planPropertyTemplates)

export const selectProjectProperties = createSelector(selectProjectFeature, (state) => state.planProperties.data)