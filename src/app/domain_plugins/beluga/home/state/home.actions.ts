import { createAction, props } from "@ngrx/store";
import { ProjectBase } from "src/app/shared/domain/project";
import { DomainSpecification } from "src/app/global_specification/domain/domain_specification";
import { ProjectMetaData } from "src/app/project-meta/domain/project-meta";

export const loadProjectMetaDataList = createAction('[beluga-home] load project meta data list');
export const loadProjectMetaDataListSuccess = createAction('[beluga-home] load project meta data list success', props<{projects: ProjectMetaData[]}>());
export const loadProjectMetaDataListFailure = createAction('[beluga-home] load project meta data list failure', props<{err: any}>());

export const createProject = createAction('[beluga-home] create new project', props<{project: ProjectBase}>());
export const createProjectSuccess = createAction('[beluga-home] create new project success');
export const createProjectFailure = createAction('[beluga-home] create new project failure', props<{err: any}>());

export const deleteProject = createAction('[beluga-home] delete project', props<{id: string}>());
export const deleteProjectSuccess = createAction('[beluga-home] delete project success');
export const deleteProjectFailure = createAction('[beluga-home] delete project failure', props<{err: any}>());


// domain specifications

export const loadDomainSpecifications = createAction('[beluga-home] load domain specifications');
export const loadDomainSpecificationsSuccess = createAction('[beluga-home] load domain specifications success', props<{domainSpecifications: DomainSpecification[]}>());
export const loadDomainSpecificationsFailure = createAction('[beluga-home] load domain specifications failure', props<{err: any}>());