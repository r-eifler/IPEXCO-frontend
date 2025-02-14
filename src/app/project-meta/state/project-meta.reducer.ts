import { createReducer, on } from "@ngrx/store";
import { DomainSpecification } from "src/app/global_specification/domain/domain_specification";
import { Creatable, CreationState } from "src/app/shared/common/creatable.interface";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { ProjectBase } from "src/app/shared/domain/project";
import { ProjectMetaData } from "../domain/project-meta";
import { createProject, createProjectFailure, createProjectSuccess, loadDomainSpecifications, loadDomainSpecificationsSuccess, loadProjectMetaDataList, loadProjectMetaDataListSuccess } from "./project-meta.actions";

export interface ProjectMetaDataState {
    projects: Loadable<ProjectMetaData[]>;
    domainSpecifications: Loadable<DomainSpecification[]>;
    createdProject: Creatable<ProjectBase>;
}


const initialState: ProjectMetaDataState = {
    projects: {state: LoadingState.Initial, data: undefined},
    domainSpecifications: {state: LoadingState.Initial, data: undefined},
    createdProject: {state: CreationState.Default, data: undefined},
}


export const projectMetaDataReducer = createReducer(
    initialState,
    on(loadProjectMetaDataList, (state): ProjectMetaDataState => ({
        ...state,
        projects: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadProjectMetaDataListSuccess, (state, {projects}): ProjectMetaDataState => ({
        ...state,
        projects: {state: LoadingState.Done, data: projects},
        createdProject: {state: CreationState.Default, data: undefined}
    })),
    on(createProject, (state, {project}): ProjectMetaDataState => ({
        ...state,
        createdProject: {state: CreationState.Pending, data: project}
    })),
    on(createProjectSuccess, (state): ProjectMetaDataState => ({
        ...state,
        createdProject: {state: CreationState.Done, data: undefined}
    })),
    on(createProjectFailure, (state): ProjectMetaDataState => ({
        ...state,
        createdProject: {state: CreationState.Error, data: undefined}
    })),
    on(loadDomainSpecifications, (state, ): ProjectMetaDataState => ({
        ...state,
        domainSpecifications: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadDomainSpecificationsSuccess, (state, {domainSpecifications}): ProjectMetaDataState => ({
        ...state,
        domainSpecifications: {state: LoadingState.Done, data: domainSpecifications}
    })),
);