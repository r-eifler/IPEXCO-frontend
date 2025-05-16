import { createReducer, on } from "@ngrx/store";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { Project } from "src/app/shared/domain/project";
import { FlightSection, getFlightSchedule, getFullStartState, getProductionSchedule } from "../../flight-section-planning/domain/flight-section";
import { BelugaProblem, BelugaProblemZ, Flight, Side } from "../../shared/domain/beluga_problem";
import { applyAction, BelugaState } from "../../shared/domain/beluga_state";
import { updateSkipIncomingJig, updateSkipOutgoingJigType, updateSkipProductionLineJig } from "../domain/schedule_utils";
import { cancelDrag, createNewBelugaAction, loadFlightSection, loadFlightSectionSuccess, loadProject, loadProjectSuccess, skipIncomingJig, skipOutgoingJigType, skipProductionJig, startDrag, stopDrag, updateFlightSectionSuccess } from "./builder.actions";

export interface DragSource{
    name: string,
    stageType: 'rack' | 'trailer' | 'incoming' | 'hangar' | 'flight'
}

export interface BuilderState {
    project: Loadable<Project>,
    flights: Loadable<Flight[]>,
    section: Loadable<FlightSection>,

    taskState: BelugaState | null | undefined,

    sizeUnit: number;

    dragSource: DragSource | null,
    draggedJig: string | null,
    draggedSides: Side[] | null,
}


const initialState: BuilderState = {
    project: {state: LoadingState.Initial, data: undefined},
    flights: {state: LoadingState.Initial, data: undefined},
    section: {state: LoadingState.Initial, data: undefined},

    taskState: null,

    sizeUnit: 15,
    dragSource: null,
    draggedJig: null,
    draggedSides: null,
}


export const BuilderReducer = createReducer(
    initialState,
    on(loadProject, (state): BuilderState => ({
        ...state,
        project: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadProjectSuccess, (state, {project}): BuilderState => ({
        ...state,
        project: {state: LoadingState.Done, data: project},
        flights: {state: LoadingState.Done, data: BelugaProblemZ.parse(project.baseTask.model).flights},
    })),
    on(loadFlightSection, (state, ): BuilderState => ({
        ...state,
        section: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadFlightSectionSuccess, (state, {section}): BuilderState => ({
        ...state,
        section: {state: LoadingState.Done, data: section},
        taskState:  getFullStartState(section),
        dragSource: null,
        draggedJig: null,
        draggedSides: null,
    })),
    on(updateFlightSectionSuccess, (state, {section}): BuilderState => ({
        ...state,
        section: {state: LoadingState.Done, data: section},
    })),
    on(createNewBelugaAction, (state, {action}): BuilderState => ({
        ...state,
        taskState: state.taskState !== null && state.taskState !== undefined && state.section.data !== undefined ?
        applyAction(
            state.taskState, 
            action, 
            getFlightSchedule( state.section.data.configurations[state.section.data.configurationIndex].flightTargetSchedule, false), 
            getProductionSchedule(state.section.data.configurations[state.section.data.configurationIndex].productionLinesTargetSchedule, false), 
            state.section.data.configurations[state.section.data.configurationIndex].siteSetUp
        ) : null,
        section:  state.section.data !== undefined ? {
            state: LoadingState.Done,
            data: {
                ...state.section.data,
                actions: [...(state.section.data?.actions ?? []), action],
            }
        } : state.section
    })),
    on(skipIncomingJig, (state, {jigName}): BuilderState => ({
        ...state,
        section:  state.section.data !== undefined ? {
            state: LoadingState.Done,
            data: {
                ...state.section.data,
                configurations:[
                    ...state.section.data.configurations.slice(0, state.section.data.configurationIndex),
                    {
                        ...state.section.data.configurations[state.section.data.configurationIndex],
                        flightTargetSchedule: updateSkipIncomingJig(jigName, state.section.data.configurations[state.section.data.configurationIndex].flightTargetSchedule)
                    },
                    ...state.section.data.configurations.slice(state.section.data.configurationIndex + 1),
                ]
            }
        } : state.section
    })),
    on(skipOutgoingJigType, (state, {jigType, index}): BuilderState => ({
        ...state,
        section:  state.section.data !== undefined ? {
            state: LoadingState.Done,
            data: {
                ...state.section.data,
                configurations:[
                    ...state.section.data.configurations.slice(0, state.section.data.configurationIndex),
                    {
                        ...state.section.data.configurations[state.section.data.configurationIndex],
                        flightTargetSchedule: updateSkipOutgoingJigType(jigType, index, state.section.data.configurations[state.section.data.configurationIndex].flightTargetSchedule)
                    },
                    ...state.section.data.configurations.slice(state.section.data.configurationIndex + 1),
                ]
            }
        } : state.section
    })),
    on(skipProductionJig, (state, {jigName, productionLine}): BuilderState => ({
        ...state,
        section:  state.section.data !== undefined ? {
            state: LoadingState.Done,
            data: {
                ...state.section.data,
                configurations:[
                    ...state.section.data.configurations.slice(0, state.section.data.configurationIndex),
                    {
                        ...state.section.data.configurations[state.section.data.configurationIndex],
                        productionLinesTargetSchedule: updateSkipProductionLineJig(jigName, productionLine, state.section.data.configurations[state.section.data.configurationIndex].productionLinesTargetSchedule)
                    },
                    ...state.section.data.configurations.slice(state.section.data.configurationIndex + 1),
                ]
            }
        } : state.section
    })),
    on(startDrag, (state, {source, jigName, sides}): BuilderState => ({
        ...state,
        dragSource: source,
        draggedJig: jigName,
        draggedSides: sides,
    })),
    on(stopDrag, (state): BuilderState => ({
        ...state,
        dragSource: null,
        draggedJig: null,
        draggedSides: null,
    })),
    on(cancelDrag, (state): BuilderState => ({
        ...state,
        dragSource: null,
        draggedJig: null,
        draggedSides: null,
    })),
);