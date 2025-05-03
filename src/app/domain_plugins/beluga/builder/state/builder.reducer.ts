import { createReducer, on } from "@ngrx/store";
import { BelugaActionType, SwitchBeluga } from "../../shared/domain/beluga_plan";
import { BelugaProblem, BelugaProblemZ, Side } from "../../shared/domain/beluga_problem";
import { applyAction, BelugaState, getInitialState } from "../../shared/domain/beluga_state";
import { FlightSectionPlan, PlanSection } from "../domain/plan";
import { cancelDrag, createNewBelugaAction, initBuilder, loadFlightSectionSuccess, loadProject, loadProjectSuccess, nextFlight, startDrag, stopDrag, updateFlightSectionSuccess } from "./builder.actions";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { FlightSection } from "../../flight-section-planning/domain/flight-section";
import { projectTaskToSection } from "../../flight-section-planning/domain/flight-section";
import { Project } from "src/app/shared/domain/project";

export interface DragSource{
    name: string,
    stageType: 'rack' | 'trailer' | 'incoming' | 'hangar' | 'flight'
}

export interface BuilderState {
    project: Loadable<Project>,
    section: Loadable<FlightSection>,
    numToProcessFlights: number,

    sizeUnit: number;
    task: BelugaProblem | null,
    taskState: BelugaState | null | undefined,
    plan: FlightSectionPlan,
    currentSection: PlanSection | null,
    dragSource: DragSource | null,
    draggedJig: string | null,
    draggedSides: Side[] | null,
}


const initialState: BuilderState = {
    project: {state: LoadingState.Initial, data: undefined},
    section: {state: LoadingState.Initial, data: undefined},
    numToProcessFlights: 1,

    sizeUnit: 15,
    task: null,
    taskState: null,
    plan: {sections: []},
    currentSection: null,
    dragSource: null,
    draggedJig: null,
    draggedSides: null,
}


export const BuilderReducer = createReducer(
    initialState,
    on(loadProject, (state): BuilderState => ({
        ...state,
        task: null,
        taskState: null
    })),
    on(loadProjectSuccess, (state, {project}): BuilderState => {
        let task = BelugaProblemZ.parse(project?.baseTask?.model);
        if(state.section.data !== undefined){
            return {
                ...state,
                project: {state: LoadingState.Done, data: project},
                task: projectTaskToSection(task, state.section.data, state.numToProcessFlights) ?? null,
            }
        }
        else{
            let taskState = getInitialState(task);
            return {
                ...state,
                project: {state: LoadingState.Done, data: project},
                task: task,
                taskState: taskState,
                currentSection: {
                    initialState: taskState,
                    actions: [],
                    finished: false
                }
            }
        }
    }),
    on(loadFlightSectionSuccess, (state, {section}): BuilderState => ({
        ...state,
        section: {state: LoadingState.Done, data: section},
        taskState: {
            ...section.startState,
            flightIndex: 0
        },
        task: state.task !== null ? projectTaskToSection(state.task, section, state.numToProcessFlights) ?? null : null,
        plan: {sections: []},
        currentSection: null,
        dragSource: null,
        draggedJig: null,
        draggedSides: null,
    })),
    on(updateFlightSectionSuccess, (state, {section}): BuilderState => ({
        ...state,
        section: {state: LoadingState.Done, data: section},
    })),
    on(initBuilder, (_, {task, initState}): BuilderState => ({
        ...initialState,
        task: task,
        taskState: initState,
    })),
    on(createNewBelugaAction, (state, {action}): BuilderState => ({
        ...state,
        taskState: state.taskState !== null && state.taskState !== undefined && state.task != null ? 
            applyAction(state.taskState, action, state.task) : null,
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
        let finalState = state.taskState !== null && state.taskState !== undefined && state.task != null ? 
            applyAction(state.taskState, switchBelugaAction, state.task) : undefined
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