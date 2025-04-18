import { createReducer, on } from "@ngrx/store";
import { ProjectMetaData } from "src/app/project-meta/domain/project-meta";
import { Creatable, CreationState } from "src/app/shared/common/creatable.interface";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { ProjectBase } from "src/app/shared/domain/project";
import { createProject, createProjectFailure, createProjectSuccess, loadProjectMetaDataList, loadProjectMetaDataListSuccess } from "./home.actions";

export interface HomeState {
    projects: Loadable<ProjectMetaData[]>;
    createdProject: Creatable<ProjectBase>;
}


const initialState: HomeState = {
    projects: {state: LoadingState.Initial, data: undefined},
    createdProject: {state: CreationState.Default, data: undefined},
}


export const HomeReducer = createReducer(
    initialState,
    on(loadProjectMetaDataList, (state): HomeState => ({
        ...state,
        projects: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadProjectMetaDataListSuccess, (state, {projects}): HomeState => ({
        ...state,
        projects: {state: LoadingState.Done, data: projects},
        createdProject: {state: CreationState.Default, data: undefined}
    })),
    on(createProject, (state, {project}): HomeState => ({
        ...state,
        createdProject: {state: CreationState.Pending, data: project}
    })),
    on(createProjectSuccess, (state): HomeState => ({
        ...state,
        createdProject: {state: CreationState.Done, data: undefined}
    })),
    on(createProjectFailure, (state): HomeState => ({
        ...state,
        createdProject: {state: CreationState.Error, data: undefined}
    })),
);