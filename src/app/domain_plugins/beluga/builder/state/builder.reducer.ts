import { createReducer, on } from "@ngrx/store";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { Project } from "src/app/shared/domain/project";
import { BelugaActionType, SwitchBeluga } from "../../shared/domain/beluga_plan";
import { BelugaProblem, BelugaProblemZ, Side } from "../../shared/domain/beluga_problem";
import { applyAction, BelugaState, getInitialState } from "../../shared/domain/beluga_state";
import { FlightSectionPlan, PlanSection } from "../domain/plan";
import { cancelDrag, createNewBelugaAction, loadProject, loadProjectSuccess, nextFlight, startDrag, stopDrag } from "./builder.actions";


export interface DragSource{
    name: string,
    stageType: 'rack' | 'trailer' | 'incoming' | 'hangar' | 'flight'
}

export interface HomeState {
    sizeUnit: number;
    project: Loadable<Project>,
    task: BelugaProblem | null,
    taskState: BelugaState | null | undefined,
    plan: FlightSectionPlan,
    currentSection: PlanSection | null,
    dragSource: DragSource | null,
    draggedJig: string | null,
    draggedSides: Side[] | null,
}


const initialState: HomeState = {
    sizeUnit: 15,
    project: {state: LoadingState.Initial, data: undefined},
    task: null,
    taskState: null,
    plan: {sections: []},
    currentSection: null,
    dragSource: null,
    draggedJig: null,
    draggedSides: null,
}


export const HomeReducer = createReducer(
    initialState,
    on(loadProject, (state): HomeState => ({
        ...state,
        project: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadProjectSuccess, (state, {project}): HomeState => {
        let task = BelugaProblemZ.parse(project?.baseTask?.model);
        let taskState = getInitialState(task);
        return {
            ...state,
            project: {state: LoadingState.Done, data: project},
            task: BelugaProblemZ.parse(project?.baseTask?.model),
            taskState,
            currentSection: {
                initialState: taskState,
                actions: [],
                finished: false
            }
        }
    }),
    on(createNewBelugaAction, (state, {action}): HomeState => ({
        ...state,
        taskState: state.taskState !== null && state.taskState !== undefined && state.task != null ? 
            applyAction(state.taskState, action, state.task) : null,
        currentSection: {
            initialState: state.currentSection?.initialState,
            finished: false,
            actions: [...(state.currentSection?.actions ?? []), action]
        }
    })),
    on(nextFlight, (state): HomeState => {
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
    on(startDrag, (state, {source, jigName, sides}): HomeState => ({
        ...state,
        dragSource: source,
        draggedJig: jigName,
        draggedSides: sides,
    })),
    on(stopDrag, (state): HomeState => ({
        ...state,
        dragSource: null,
        draggedJig: null,
        draggedSides: null,
    })),
    on(cancelDrag, (state): HomeState => ({
        ...state,
        dragSource: null,
        draggedJig: null,
        draggedSides: null,
    })),
);