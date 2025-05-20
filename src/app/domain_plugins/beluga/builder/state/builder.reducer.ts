import { createReducer, on } from "@ngrx/store";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { Project } from "src/app/shared/domain/project";
import { BelugaConfiguration, FlightSection, getFlightSchedule, getFullStartState, getProductionSchedule } from "../../flight-section-planning/domain/flight-section";
import { BelugaProblem, BelugaProblemZ, Flight, Side } from "../../shared/domain/beluga_problem";
import { applyAction, BelugaState } from "../../shared/domain/beluga_state";
import { unskipNotDelivered, updateSkipIncomingJig, updateSkipOutgoingJigType, updateSkipProductionLineJig } from "../domain/schedule_utils";
import { cancelDrag, createNewBelugaAction, loadFlightSection, loadFlightSectionSuccess, loadProject, loadProjectSuccess, skipIncomingJig, skipOutgoingJigType, skipProductionJig, startDrag, stopDrag, updateFlightSectionSuccess } from "./builder.actions";
import { BelugaAction } from "../../shared/domain/beluga_plan";
import { none } from "ramda";

export interface DragSource{
    name: string,
    stageType: 'rack' | 'trailer' | 'incoming' | 'hangar' | 'flight'
}

export interface BuilderState {
    project: Loadable<Project>,
    flights: Loadable<Flight[]>,
    section: Loadable<FlightSection>,

    config: BelugaConfiguration | null,
    taskState: BelugaState | null | undefined,
    actions: BelugaAction[]

    sizeUnit: number;

    dragSource: DragSource | null,
    draggedJig: string | null,
    draggedSides: Side[] | null,
}


const initialState: BuilderState = {
    project: {state: LoadingState.Initial, data: undefined},
    flights: {state: LoadingState.Initial, data: undefined},
    section: {state: LoadingState.Initial, data: undefined},

    config: null,
    taskState: null,
    actions: [],

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
    on(loadFlightSectionSuccess, (state, {section}): BuilderState => {
        const taskState = getFullStartState(section);
        if(taskState == undefined){
            return {...state};
        }
        return {
            ...state,
            section: {state: LoadingState.Done, data: section},
            taskState,
            config: {
                ...section.configurations[section.configurationIndex],
                productionLinesTargetSchedule: unskipNotDelivered(section.configurations[section.configurationIndex].productionLinesTargetSchedule, taskState?.productionLines)
            },
            actions: [],
            dragSource: null,
            draggedJig: null,
            draggedSides: null,
        }
    }),
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
        actions: [...(state.actions ?? []), action]
    })),
    on(skipIncomingJig, (state, {jigName}): BuilderState => ({
        ...state,
        config: state.config !== null ? {
            ...state.config,
            flightTargetSchedule: updateSkipIncomingJig(jigName, state.config?.flightTargetSchedule)
        } : null,
    })),
    on(skipOutgoingJigType, (state, {jigType, index}): BuilderState => ({
        ...state,
        config: state.config !== null ? {
            ...state.config,
            flightTargetSchedule: updateSkipOutgoingJigType(jigType, index, state.config?.flightTargetSchedule)
        } : null
    })),
    on(skipProductionJig, (state, {jigName, productionLine}): BuilderState => ({
        ...state,
        config: state.config !== null ? {
            ...state.config,
            productionLinesTargetSchedule: updateSkipProductionLineJig(jigName, productionLine, state.config?.productionLinesTargetSchedule)
        } : null
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