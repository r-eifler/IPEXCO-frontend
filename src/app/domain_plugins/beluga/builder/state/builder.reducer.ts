import { createReducer, on } from "@ngrx/store";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { Project } from "src/app/shared/domain/project";
import { createNewBelugaAction, initTask, loadProject, loadProjectSuccess, nextFlight } from "./builder.actions";
import { applyAction, BelugaState, getInitialState } from "../../shared/domain/beluga_state";
import { BelugaProblem, BelugaProblemZ } from "../../shared/domain/beluga_problem";
import { FlightSectionPlan, PlanSection } from "../domain/plan";
import { BelugaActionType, SwitchBeluga } from "../../shared/domain/beluga_plan";
import { finished } from "stream";

export interface HomeState {
    project: Loadable<Project>,
    task: BelugaProblem | null,
    taskState: BelugaState | null | undefined,
    plan: FlightSectionPlan,
    currentSection: PlanSection,
}


const initialState: HomeState = {
    project: {state: LoadingState.Initial, data: undefined},
    task: null,
    taskState: null,
    plan: {sections: []},
    currentSection:  {
        actions: [],
        finished: false
    }
}


export const HomeReducer = createReducer(
    initialState,
    on(loadProject, (state): HomeState => ({
        ...state,
        project: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadProjectSuccess, (state, {project}): HomeState => {
        let task = BelugaProblemZ.parse(project?.baseTask?.model);
        return {
            ...state,
            project: {state: LoadingState.Done, data: project},
            task: BelugaProblemZ.parse(project?.baseTask?.model),
            taskState: getInitialState(task),
        }
    }),
    on(createNewBelugaAction, (state, {action}): HomeState => ({
        ...state,
        taskState: state.taskState !== null && state.taskState !== undefined && state.task != null ? 
            applyAction(state.taskState, action, state.task) : null,
        currentSection: {
            ...state.currentSection,
            actions: [...state.currentSection.actions, action]
        }
    })),
    on(nextFlight, (state): HomeState => {
        let switchBelugaAction : SwitchBeluga = {name: BelugaActionType.SWITCH_TO_NEXT_BELUGA};
        let finishedSection = {
            finished: true,
            actions: [...state.currentSection.actions, switchBelugaAction]
        }
        return {
            ...state,
            taskState: state.taskState !== null && state.taskState !== undefined && state.task != null ? 
                applyAction(state.taskState, switchBelugaAction, state.task) : null,
            plan: {
                sections: [...state.plan.sections, finishedSection]
            },
            currentSection: {
                finished: false,
                actions: []
            }
        }
    }),
);