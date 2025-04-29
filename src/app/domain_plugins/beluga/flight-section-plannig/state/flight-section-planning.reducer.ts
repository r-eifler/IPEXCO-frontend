import { createReducer, on } from "@ngrx/store";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { Project } from "src/app/shared/domain/project";
import { addRootSectionToFlightPlanForest, addSectionToFlightPlanForest, decreaseFlightIndex, increaseFlightIndex, loadProject, loadProjectSuccess, newFlightPlanTree } from "./flight-section-planning.actions";
import { FlightPlanForest, FlightSection } from "../domain/flight-section";
import { BelugaProblem, BelugaProblemZ } from "../../shared/domain/beluga_problem";
import { PlanSection } from "../../builder/domain/plan";

export interface FlightSectionPlanningState {
    project: Loadable<Project>;
    task: Loadable<BelugaProblem>;
    forest: Loadable<FlightPlanForest>;
    flightStartIndex: number; // inclusive
    flightEndIndex: number; // exclusive
}


const initialState: FlightSectionPlanningState = {
    project: {state: LoadingState.Initial, data: undefined},
    task: {state: LoadingState.Initial, data: undefined},
    forest: {state: LoadingState.Initial, data: undefined},
    flightStartIndex: 0,
    flightEndIndex: 5,
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
        task:   {state: LoadingState.Done, data: BelugaProblemZ.parse(project?.baseTask?.model)}
    })),
    on(addSectionToFlightPlanForest, (state, {section, treeIndex}): FlightSectionPlanningState => ({
        ...state,
        forest:  state.forest.data !== undefined ?
            {state: LoadingState.Done, data: {
                ...state.forest.data,
                trees: [
                    ...state.forest.data.trees.slice(0,treeIndex) ,
                    {
                        ... state.forest.data.trees[treeIndex],
                        sections: {...state.forest.data.trees[treeIndex].sections,  [section.nodeId]: section}
                    },
                    ...state.forest.data.trees.slice(treeIndex),
                ].flat()
            }} : state.forest 
    })),
    on(addRootSectionToFlightPlanForest, (state, {section, treeIndex}): FlightSectionPlanningState => ({
        ...state,
        forest:  state.forest.data !== undefined ?
            {state: LoadingState.Done, data: {
                ...state.forest.data,
                trees: [
                    ...state.forest.data.trees.slice(0,treeIndex) ,
                    {
                        ... state.forest.data.trees[treeIndex],
                        sections: {...state.forest.data.trees[treeIndex].sections,  [section.nodeId]: section},
                        root:section.nodeId,
                    },
                    ...state.forest.data.trees.slice(treeIndex),
                ]
            }} : state.forest 
    })),
    on(newFlightPlanTree, (state): FlightSectionPlanningState => ({
        ...state,
        forest:  state.forest.data !== undefined ?
            {state: LoadingState.Done, data: {
                ...state.forest.data,
                trees: [
                    ...state.forest.data.trees,
                    {
                        sections:{},
                        root: null,
                        selectedLeave: null
                    },
                ]
            }} : state.forest 
    })),
    on(increaseFlightIndex, (state, {offset}): FlightSectionPlanningState => {
        let max_offset = (state.task.data?.flights.length ?? 0) - state.flightEndIndex
        return {
            ...state,
            flightEndIndex: state.flightEndIndex + Math.min(offset,max_offset),
            flightStartIndex: state.flightStartIndex + Math.min(offset,max_offset),
        }
    }),
    on(decreaseFlightIndex, (state, {offset}): FlightSectionPlanningState => ({
        ...state,
        flightEndIndex: state.flightEndIndex - Math.min(offset,state.flightStartIndex),
        flightStartIndex: state.flightStartIndex - Math.min(offset,state.flightStartIndex),
    })),
);