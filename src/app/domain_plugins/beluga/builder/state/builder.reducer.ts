import { createReducer, on } from "@ngrx/store";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { Project } from "src/app/shared/domain/project";
import { FlightSection, FlightTargetSchedule, getFlightSchedule, getFullState, getProductionSchedule, GoalStatus, ProductionLineTargetSchedule } from "../../flight-section-planning/domain/flight-section";
import { BelugaActionType, SwitchBeluga } from "../../shared/domain/beluga_plan";
import { BelugaProblemZ, Side } from "../../shared/domain/beluga_problem";
import { applyAction, BelugaState, getInitialState } from "../../shared/domain/beluga_state";
import { BelugaSightSetUp, getSightSetUp } from "../../shared/domain/sight_set_up";
import { FlightSectionPlan, PlanSection } from "../domain/plan";
import { cancelDrag, createNewBelugaAction, loadFlightSectionSuccess, loadProject, loadProjectSuccess, nextFlight, startDrag, stopDrag, updateFlightSectionSuccess } from "./builder.actions";

export interface DragSource{
    name: string,
    stageType: 'rack' | 'trailer' | 'incoming' | 'hangar' | 'flight'
}

export interface BuilderState {
    project: Loadable<Project>,

    section: Loadable<FlightSection>,
    numToProcessFlights: number,

    sightSetUp: BelugaSightSetUp | null,
    flightsTargetSchedule: FlightTargetSchedule[] | null,
    productionLinesTargetSchedule: ProductionLineTargetSchedule[] | null,

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
    flightsTargetSchedule: null,
    productionLinesTargetSchedule: null,
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
                flightsTargetSchedule: task.flights.map(f => ({
                    name: f.name, 
                    incoming: f.incoming.map(j => ({jig: j, status: GoalStatus.HARD})), 
                    outgoing: f.outgoing.map(j => ({jigType: j, status: GoalStatus.HARD})),
                })),
                productionLinesTargetSchedule: task.production_lines.map(pl => ({
                    name: pl.name,
                    schedule: pl.schedule.map(j => ({
                        jig: j,
                        status: GoalStatus.HARD
                    }))
                })),
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
            flightsTargetSchedule: section.flightTargetSchedule ? [section.flightTargetSchedule] : null,
            productionLinesTargetSchedule: section.productionLinesTargetSchedule ?? null,
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
        taskState: state.taskState !== null && state.taskState !== undefined && state.flightsTargetSchedule !== null  &&  state.productionLinesTargetSchedule !== null  && state.sightSetUp !== null ?
        applyAction(
            state.taskState, 
            action, 
            state.flightsTargetSchedule.map(s => getFlightSchedule(s, GoalStatus.HARD)), 
            getProductionSchedule(state.productionLinesTargetSchedule, GoalStatus.HARD), 
            state.sightSetUp
        ) : null,
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
        let finalState = state.taskState !== null && state.taskState !== undefined && state.flightsTargetSchedule !== null  &&  state.productionLinesTargetSchedule !== null  && state.sightSetUp !== null ?
        applyAction(
            state.taskState, 
            switchBelugaAction, 
            state.flightsTargetSchedule.map(s => getFlightSchedule(s, GoalStatus.HARD)), 
            getProductionSchedule(state.productionLinesTargetSchedule, GoalStatus.HARD), 
            state.sightSetUp
        ) : undefined;
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