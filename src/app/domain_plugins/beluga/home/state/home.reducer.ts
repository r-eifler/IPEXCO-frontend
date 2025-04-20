import { createReducer, on } from "@ngrx/store";
import { DomainSpecification } from "src/app/global_specification/domain/domain_specification";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { Project } from "src/app/shared/domain/project";
import { loadDomainSpecifications, loadDomainSpecificationsSuccess, loadProject, loadProjects, loadProjectsSuccess, loadProjectSuccess } from "./home.actions";

export interface HomeState {
    projects: Loadable<Project[]>;
    domainSpecifications: Loadable<DomainSpecification[]>;
    project: Loadable<Project>;
}


const initialState: HomeState = {
    projects: {state: LoadingState.Initial, data: undefined},
    domainSpecifications: {state: LoadingState.Initial, data: undefined},
    project: {state: LoadingState.Initial, data: undefined},
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
    })),
    on(loadDomainSpecifications, (state, ): HomeState => ({
        ...state,
        domainSpecifications: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadDomainSpecificationsSuccess, (state, {domainSpecifications}): HomeState => ({
        ...state,
        domainSpecifications: {state: LoadingState.Done, data: domainSpecifications}
    })),
    on(loadProject, (state): HomeState => ({
        ...state,
        project: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadProjectSuccess, (state, {project}): HomeState => ({
        ...state,
        project: {state: LoadingState.Done, data: project},
    })),
);