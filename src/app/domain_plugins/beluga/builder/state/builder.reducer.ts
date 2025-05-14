import { createReducer, on } from "@ngrx/store";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { Project } from "src/app/shared/domain/project";
import { FlightSection, getFlightSchedule, getFullState, getProductionSchedule } from "../../flight-section-planning/domain/flight-section";
import { Side } from "../../shared/domain/beluga_problem";
import { applyAction, BelugaState } from "../../shared/domain/beluga_state";
import { updateSkipIncomingJig, updateSkipOutgoingJigType } from "../domain/schedule_utils";
import { cancelDrag, createNewBelugaAction, loadFlightSectionSuccess, loadProject, loadProjectSuccess, skipIncomingJig, skipOutgoingJigType, startDrag, stopDrag, updateFlightSectionSuccess } from "./builder.actions";

export interface DragSource{
    name: string,
    stageType: 'rack' | 'trailer' | 'incoming' | 'hangar' | 'flight'
}

export interface BuilderState {
    project: Loadable<Project>,
    section: Loadable<FlightSection>,

    taskState: BelugaState | null | undefined,

    sizeUnit: number;

    dragSource: DragSource | null,
    draggedJig: string | null,
    draggedSides: Side[] | null,
}


const initialState: BuilderState = {
    project: {state: LoadingState.Initial, data: undefined},
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
        taskState: null
    })),
    on(loadProjectSuccess, (state, {project}): BuilderState => ({
        ...state,
        project: {state: LoadingState.Done, data: project},
    })),
    on(loadFlightSectionSuccess, (state, {section}): BuilderState => ({
        ...state,
        section: {state: LoadingState.Done, data: section},
        taskState:  getFullState(section),
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
            [getFlightSchedule( state.section.data.flightTargetSchedule, false)], 
            getProductionSchedule(state.section.data.productionLinesTargetSchedule, false), 
            state.section.data.siteSetUp
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
                flightTargetSchedule: updateSkipIncomingJig(jigName, state.section.data.flightTargetSchedule)
            }
        } : state.section
    })),
    on(skipOutgoingJigType, (state, {jigType, index}): BuilderState => ({
        ...state,
        section:  state.section.data !== undefined ? {
            state: LoadingState.Done,
            data: {
                ...state.section.data,
                flightTargetSchedule: updateSkipOutgoingJigType(jigType, index, state.section.data.flightTargetSchedule)
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