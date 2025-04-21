import { createReducer, on } from "@ngrx/store";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { Project } from "src/app/shared/domain/project";
import { initTask, loadProject, loadProjectSuccess } from "./builder.actions";
import { BelugaState, getInitialState } from "../../shared/domain/beluga_state";
import { BelugaProblemZ } from "../../shared/domain/beluga_problem";

export interface HomeState {
    project: Loadable<Project>;
    taskState: BelugaState | null
}


const initialState: HomeState = {
    project: {state: LoadingState.Initial, data: undefined},
    taskState: null
}


export const HomeReducer = createReducer(
    initialState,
    on(loadProject, (state): HomeState => ({
        ...state,
        project: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadProjectSuccess, (state, {project}): HomeState => ({
        ...state,
        project: {state: LoadingState.Done, data: project},
        taskState: getInitialState(BelugaProblemZ.parse(project?.baseTask?.model)),
    })),
    on(initTask, (state, {task}): HomeState => ({
        ...state,
        taskState: getInitialState(task)
    })),
);