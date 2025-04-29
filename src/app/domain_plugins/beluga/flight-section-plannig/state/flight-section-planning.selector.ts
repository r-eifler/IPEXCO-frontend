import { createSelector } from "@ngrx/store";
import { FlightSectionPlanningFeature } from "./flight-section-planning.feature";
import { BelugaProblemZ } from "../../shared/domain/beluga_problem";


const selectState = FlightSectionPlanningFeature.selectFlightSectionPlanningState


// Project

export const selectProject = createSelector(selectState, (state) => state.project.data)

// Model general

export const selectTask = createSelector(selectState, 
    (state) => (state.task.data)
);

export const selectFlights = createSelector(selectTask, 
    (task) => task?.flights)

// Forest

export const selectFlightSectionForest = createSelector(selectState, 
    (state) => (state.forest.data))


export const selectFlightStartIndex = createSelector(selectState, 
    (state) => (state.flightStartIndex))

export const selectFlightEndIndex = createSelector(selectState, 
    (state) => (state.flightEndIndex))


// model tree

export const selectFlightInRange = createSelector(selectFlights, selectFlightStartIndex, selectFlightEndIndex,
    (flights, start, end) => start !== null && end !== null ? flights?.slice(start,end) : []);