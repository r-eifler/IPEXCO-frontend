import { createReducer, on } from "@ngrx/store";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { Project } from "src/app/shared/domain/project";
import { loadProject, loadProjectSuccess } from "./policy-testing.actions";

export interface PolicyTestingState {
    project: Loadable<Project>,
}

const initialState: PolicyTestingState = {
    project: {state: LoadingState.Initial, data: undefined},
}

export const PolicyTestingReducer = createReducer(
    initialState,
    on(loadProject, (state): PolicyTestingState => ({
        ...state,
        project: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadProjectSuccess, (state, {project}): PolicyTestingState => ({
        ...state,
        project: {state: LoadingState.Done, data: project},
    }))
);