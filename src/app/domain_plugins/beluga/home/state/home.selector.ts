import { CreationState } from "src/app/shared/common/creatable.interface";
import { createSelector } from "@ngrx/store";
import { HomeFeature } from "./home.feature";


const selectState = HomeFeature.selectHomeFeatureState

export const selectProjectsMetaData = createSelector(selectState, (state) => state.projects.data)


export const selectProjectCreationPending = createSelector(selectState, 
    (state) => state.createdProject.state === CreationState.Pending)


export const selectProjectCreationNone = createSelector(selectState, 
    (state) => state.createdProject.state === CreationState.Default || 
        state.createdProject.state === CreationState.Done)


export const selectProjectCreationError = createSelector(selectState, 
    (state) => state.createdProject.state === CreationState.Error)
