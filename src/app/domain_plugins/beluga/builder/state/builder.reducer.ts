import { createReducer, on } from "@ngrx/store";
import { BelugaActionType, SwitchBeluga } from "../../shared/domain/beluga_plan";
import { BelugaProblem, BelugaProblemZ, Flight, ProductionLine, Side } from "../../shared/domain/beluga_problem";
import { applyAction, BelugaState, getInitialState } from "../../shared/domain/beluga_state";
import { FlightSectionPlan, PlanSection } from "../domain/plan";
import { cancelDrag, createNewBelugaAction, initBuilder, loadFlightSectionSuccess, loadProject, loadProjectSuccess, nextFlight, startDrag, stopDrag, updateFlightSectionSuccess } from "./builder.actions";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { FlightSection, getFullState } from "../../flight-section-planning/domain/flight-section";
import { projectTaskToSection } from "../../flight-section-planning/domain/flight-section";
import { Project } from "src/app/shared/domain/project";
import { BelugaSightSetUp, getSightSetUp } from "../../shared/domain/sight_set_up";

export interface DragSource{
    name: string,
    stageType: 'rack' | 'trailer' | 'incoming' | 'hangar' | 'flight'
}

export interface BuilderState {
    project: Loadable<Project>,

    section: Loadable<FlightSection>,
    numToProcessFlights: number,
    sightSetUp: BelugaSightSetUp | null,
    flightsScheduled: Flight[] | null,
    productionLinesScheduled: ProductionLine[] | null,
    taskState: BelugaState | null | undefined,

    plan: FlightSectionPlan,
    currentSection: PlanSection | null,

    sizeUnit: number;

    dragSource: DragSource | null,
    draggedJig: string | null,
    draggedSides: Side[] | null,
}


const initialState: BuilderState = {
    project: {state: LoadingState.Initial, data: undefined},

    section: {state: LoadingState.Initial, data: undefined},
    numToProcessFlights: 1,
    sightSetUp: null,
    flightsScheduled: null,
    productionLinesScheduled: null,
    taskState: null,

    plan: {sections: []},
    currentSection: null,

    sizeUnit: 15,
    dragSource: null,
    draggedJig: null,
    draggedSides: null,
}


export const BuilderReducer = createReducer(
    initialState,
    on(loadProject, (state): BuilderState => ({
        ...state,
        sightSetUp: null,
        taskState: null
    })),
    on(loadProjectSuccess, (state, {project}): BuilderState => {
        const task = BelugaProblemZ.parse(project?.baseTask?.model);
        if(state.section.data !== undefined){
            const fullState = getFullState(state.section.data)
            return {
                ...state,
                project: {state: LoadingState.Done, data: project},
                sightSetUp: getSightSetUp(task),
                taskState: fullState
            }
        }
        else{
            let taskState = getInitialState(task);
            return {
                ...state,
                project: {state: LoadingState.Done, data: project},
                sightSetUp: getSightSetUp(task),
                flightsScheduled:task.flights,
                productionLinesScheduled: task.production_lines,
                taskState: taskState,
                currentSection: {
                    initialState: taskState,
                    actions: [],
                    finished: false
                }
            }
        }
    }),
    on(loadFlightSectionSuccess, (state, {section}): BuilderState => {
        const fullState = getFullState(state.section.data)
        return {
            ...state,
            section: {state: LoadingState.Done, data: section},
            taskState: fullState,
            flightsScheduled: section.flightScheduled ? [section.flightScheduled] : null,
            productionLinesScheduled: section.productionLinesScheduled ?? null,
            plan: {sections: []},
            currentSection: null,
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
        taskState: state.taskState !== null && state.taskState !== undefined && state.flightsScheduled !== null  &&  state.productionLinesScheduled !== null  && state.sightSetUp !== null ?
            applyAction(state.taskState, action, state.flightsScheduled, state.productionLinesScheduled, state.sightSetUp) : null,
        currentSection: {
            initialState: state.currentSection?.initialState,
            finished: false,
            actions: [...(state.currentSection?.actions ?? []), action]
        }
    })),
    on(nextFlight, (state): BuilderState => {
        let switchBelugaAction : SwitchBeluga = {name: BelugaActionType.SWITCH_TO_NEXT_BELUGA};
        let finishedSection = {
            initialState: state.currentSection?.initialState,
            finished: true,
            actions: [...(state.currentSection?.actions ?? []), switchBelugaAction]
        };
        let finalState = state.taskState !== null && state.taskState !== undefined && state.flightsScheduled !== null  &&  state.productionLinesScheduled !== null  && state.sightSetUp !== null ?
        applyAction(state.taskState, switchBelugaAction, state.flightsScheduled, state.productionLinesScheduled, state.sightSetUp) : undefined;
        return {
            ...state,
            taskState: finalState,
            plan: {
                sections: [...state.plan.sections, finishedSection]
            },
            currentSection: {
                initialState: finalState,
                finished: false,
                actions: []
            }
        }
    }),
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