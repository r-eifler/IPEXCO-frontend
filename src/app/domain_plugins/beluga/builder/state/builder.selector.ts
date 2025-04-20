import { createSelector } from "@ngrx/store";
import { BuilderFeature } from "./builder.feature";


const selectState = BuilderFeature.selectBuilderFeatureState

export const selectProject = createSelector(selectState, 
    (state) => (state.project.data))