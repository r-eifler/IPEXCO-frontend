import { createAction, props } from "@ngrx/store";
import { DomainSpecification } from "src/app/global_specification/domain/domain_specification";
import { Project, ProjectBase } from "src/app/shared/domain/project";


export const loadProject = createAction('[beluga-home] load project', props<{id: string}>());
export const loadProjectSuccess = createAction('[beluga-home] load project success', props<{project: Project}>());
export const loadProjectFailure = createAction('[beluga-home] load project failure', props<{err: any}>());


export const loadProjects = createAction('[beluga-home] load projects');
export const loadProjectsSuccess = createAction('[beluga-home] load projects success', props<{projects: Project[]}>());
export const loadProjectsFailure = createAction('[beluga-home] load projects failure', props<{err: any}>());

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