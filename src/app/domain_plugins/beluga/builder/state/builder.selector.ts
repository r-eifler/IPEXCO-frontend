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



// Plan

export const selectCurrentPlanSection = createSelector(selectState, 
    (state) => (state.currentSection))


// Task State

export const selectTaskState = createSelector(selectState, 
    (state) => (state.taskState))


// flight
export const selectCurrentFlight = createSelector(selectState, 
    (state) => (state.taskState?.flightIndex !== null && state.taskState?.flightIndex  !== undefined ? 
        state.task?.flights[state.taskState?.flightIndex ] : null))

// Trailers

export const selectAvailableBelugaTrailers = createSelector(selectState, 
    (state) => (state.task?.trailers_beluga.filter(t => state.taskState?.trailersBeluga[t.name] == null) ?? []))

export const selectAvailableFactoryTrailers = createSelector(selectState, 
    (state) => (state.task?.trailers_factory.filter(t => state.taskState?.trailersFactory[t.name] == null) ?? []))