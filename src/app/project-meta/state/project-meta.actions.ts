import { createAction, props } from "@ngrx/store";
import { ProjectMetaData } from "../domain/project-meta";
import { Project } from "src/app/shared/domain/project";
import { DomainSpecification } from "src/app/global_specification/domain/domain_specification";

export const loadProjectMetaDataList = createAction('[project-meta] load project meta data list');
export const loadProjectMetaDataListSuccess = createAction('[project-meta] load project meta data list success', props<{projects: ProjectMetaData[]}>());
export const loadProjectMetaDataListFailure = createAction('[project-meta] load project meta data list failure');

export const createProject = createAction('[project-meta] create new project', props<{project: Project}>());
export const createProjectSuccess = createAction('[project-meta] create new project success');
export const createProjectFailure = createAction('[project-meta] create new project failure');

export const deleteProject = createAction('[project-meta] delete project', props<{id: string}>());
export const deleteProjectSuccess = createAction('[project-meta] delete project success');
export const deleteProjectFailure = createAction('[project-meta] delete project failure');


// domain specifications

export const loadDomainSpecifications = createAction('[project-meta] load  domain specifications');
export const loadDomainSpecificationsSuccess = createAction('[project-meta] load  domain specifications success', props<{domainSpecifications: DomainSpecification[]}>());
export const loadDomainSpecificationsFailure = createAction('[project-meta] load  domain specifications failure');