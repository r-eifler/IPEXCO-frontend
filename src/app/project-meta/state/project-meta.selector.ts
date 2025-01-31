import { createFeatureSelector, createSelector } from "@ngrx/store";
import { projectMetaDataFeature, ProjectMetaDataState } from "./project-meta.reducer";
import { CreationState } from "src/app/shared/common/creatable.interface";


const selectProjectMetaDataFeature = createFeatureSelector<ProjectMetaDataState>(projectMetaDataFeature);

export const selectProjectsMetaData = createSelector(selectProjectMetaDataFeature, (state) => state.projects.data)


export const selectProjectCreationPending = createSelector(selectProjectMetaDataFeature, 
    (state) => state.createdProject.state === CreationState.Pending)


export const selectProjectCreationNone = createSelector(selectProjectMetaDataFeature, 
    (state) => state.createdProject.state === CreationState.Default || 
        state.createdProject.state === CreationState.Done)


export const selectProjectCreationError = createSelector(selectProjectMetaDataFeature, 
    (state) => state.createdProject.state === CreationState.Error)


export const selectDomainSpecifications = createSelector(selectProjectMetaDataFeature, (state) => state.domainSpecifications.data)