import { createReducer, on } from "@ngrx/store";
import { Project } from "../domain/project";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { loadProject, loadProjectSuccess, updateProject, updateProjectSuccess } from "./project.actions";

export interface ProjectState {
    project: Loadable<Project>;
}

export const projectFeature = 'project';

const initialState: ProjectState = {
    project: {state: LoadingState.Initial, data: undefined}
}


export const projectReducer = createReducer(
    initialState,
    on(loadProject, (state): ProjectState => ({
        ...state,
        project: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadProjectSuccess, (state, {project}): ProjectState => ({
        ...state,
        project: {state: LoadingState.Done, data: project}
    })),
    on(updateProject, (state): ProjectState => ({
        ...state,
        project: {state: LoadingState.Loading, data: undefined}
    })),
    on(updateProjectSuccess, (state, {project}): ProjectState => ({
        ...state,
        project: {state: LoadingState.Done, data: project}
    })),
);