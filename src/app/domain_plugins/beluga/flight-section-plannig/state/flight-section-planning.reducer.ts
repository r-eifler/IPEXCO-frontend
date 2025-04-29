import { createReducer, on } from "@ngrx/store";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { Project } from "src/app/shared/domain/project";
import { addRootSectionToFlightPlanForest, addSectionToFlightPlanForest, loadProject, loadProjectSuccess } from "./flight-section-planning.actions";
import { FlightPlanForest } from "../domain/flight-section";

export interface FlightSectionPlanningState {
    project: Loadable<Project>;
    forest: Loadable<FlightPlanForest>;
    flightStartIndex: number | null; // inclusive
    flightEndIndex: number | null; // exclusive
}


const initialState: FlightSectionPlanningState = {
    project: {state: LoadingState.Initial, data: undefined},
    forest: {state: LoadingState.Initial, data: undefined},
    flightStartIndex: 0,
    flightEndIndex: 6,
}


export const FlightSectionPlanningReducer = createReducer(
    initialState,
    on(loadProject, (state): FlightSectionPlanningState => ({
        ...state,
        project: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadProjectSuccess, (state, {project}): FlightSectionPlanningState => ({
        ...state,
        project: {state: LoadingState.Done, data: project},
    })),
    on(addSectionToFlightPlanForest, (state, {section}): FlightSectionPlanningState => ({
        ...state,
        forest:  state.forest.data !== undefined ?
        {state: LoadingState.Done, data: {
            ...state.forest.data,
            sections: {...state.forest.data?.sections, [section.treeId]: section}
        }} : state.forest
    })),
    on(addRootSectionToFlightPlanForest, (state, {section}): FlightSectionPlanningState => ({
        ...state,
        forest:  state.forest.data !== undefined ?
        {state: LoadingState.Done, data: {
            ...state.forest.data,
            sections: {...state.forest.data?.sections, [section.treeId]: section},
            roots: [...state.forest.data?.roots, section.treeId]
        }} : state.forest
    })),
);