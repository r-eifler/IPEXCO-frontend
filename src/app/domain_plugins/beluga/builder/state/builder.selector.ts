import { createSelector } from "@ngrx/store";
import { BuilderFeature } from "./builder.feature";
import { BelugaProblemZ } from "../../shared/domain/beluga_problem";


const selectState = BuilderFeature.selectBuilderFeatureState

export const selectProject = createSelector(selectState, 
    (state) => (state.project.data))

export const selectTask = createSelector(selectState, 
    (state) => (state.project.data?.baseTask?.model != null ? 
    BelugaProblemZ.parse(state.project.data?.baseTask?.model) : null)
)

export const selectTaskState = createSelector(selectState, 
    (state) => (state.taskState))