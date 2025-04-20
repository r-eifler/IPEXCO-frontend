import { createReducer, on } from "@ngrx/store";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { Project } from "src/app/shared/domain/project";
import { loadProject, loadProjectSuccess } from "./builder.actions";

export interface HomeState {
    project: Loadable<Project>;
}


const initialState: HomeState = {
    project: {state: LoadingState.Initial, data: undefined},
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
    })),
);