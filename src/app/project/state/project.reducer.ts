import { createReducer, on } from "@ngrx/store";
import { Project } from "../domain/project";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { loadProjectList, loadProjectListSuccess } from "./project.actions";

export interface ProjectState {
    projects: Loadable<Project[]>;
}

export const projectFeature = 'project';

const initialState: ProjectState = {
    projects: {state: LoadingState.Initial, data: undefined}
}


export const projectReducer = createReducer(
    initialState,
    on(loadProjectList, (state): ProjectState => ({
        ...state,
        projects: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadProjectListSuccess, (state, {projects}): ProjectState => ({
        ...state,
        projects: {state: LoadingState.Done, data: projects}
    }))
);