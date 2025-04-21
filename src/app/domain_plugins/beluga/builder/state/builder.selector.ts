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


// Hangars 

export const selectAvailableHangars = createSelector(selectState, 
    (state) => (state.task?.hangars.filter(h => state.taskState?.hangars[h] == null) ?? []))


// ProductionLine 

export const selectDeliverableJigs = createSelector(selectState, 
    (state) => (state.task?.production_lines.reduce((acc,c) => c.schedule.length == 0 ? acc : {...acc, [c.schedule[0]]: c.name}, {}) as Record<string,string>));
