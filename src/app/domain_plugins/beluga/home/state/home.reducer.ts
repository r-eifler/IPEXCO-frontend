import { createReducer, on } from "@ngrx/store";
import { DomainSpecification } from "src/app/global_specification/domain/domain_specification";
import { Creatable, CreationState } from "src/app/shared/common/creatable.interface";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { Project, ProjectBase } from "src/app/shared/domain/project";
import { createProject, createProjectFailure, createProjectSuccess, loadDomainSpecifications, loadDomainSpecificationsSuccess, loadProjects, loadProjectsSuccess } from "./home.actions";

export interface HomeState {
    projects: Loadable<Project[]>;
    domainSpecifications: Loadable<DomainSpecification[]>;
    createdProject: Creatable<ProjectBase>;
}


const initialState: HomeState = {
    projects: {state: LoadingState.Initial, data: undefined},
    domainSpecifications: {state: LoadingState.Initial, data: undefined},
    createdProject: {state: CreationState.Default, data: undefined},
}


export const HomeReducer = createReducer(
    initialState,
    on(loadProjects, (state): HomeState => ({
        ...state,
        projects: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadProjectsSuccess, (state, {projects}): HomeState => ({
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
    on(loadDomainSpecifications, (state, ): HomeState => ({
        ...state,
        domainSpecifications: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadDomainSpecificationsSuccess, (state, {domainSpecifications}): HomeState => ({
        ...state,
        domainSpecifications: {state: LoadingState.Done, data: domainSpecifications}
    })),
);