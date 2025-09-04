import { createAction, props } from "@ngrx/store";
import { DomainSpecification } from "src/app/global_specification/domain/domain_specification";
import { PlanProperty, PlanPropertyOfProject } from "src/app/shared/domain/plan-property/plan-property";
import { Project, ProjectBase } from "src/app/shared/domain/project";
import { BelugaProblem } from "../../shared/domain/beluga_problem";
import { Service } from "src/app/global_specification/domain/services";


export const loadProject = createAction('[beluga-home] load project', props<{id: string}>());
export const loadProjectSuccess = createAction('[beluga-home] load project success', props<{project: Project}>());
export const loadProjectFailure = createAction('[beluga-home] load project failure', props<{err: any}>());

export const updateProject = createAction('[beluga-home] update project', props<{project: Project}>());
export const updateProjectSuccess = createAction('[beluga-home] update project success', props<{project: Project}>());
export const updateProjectFailure = createAction('[beluga-home] update project failure',  props<{err: any}>());

export const loadProjects = createAction('[beluga-home] load projects');
export const loadProjectsSuccess = createAction('[beluga-home] load projects success', props<{projects: Project[]}>());
export const loadProjectsFailure = createAction('[beluga-home] load projects failure', props<{err: any}>());

export const createProject = createAction('[beluga-home] create new project', props<{project: ProjectBase}>());
export const createProjectSuccess = createAction('[beluga-home] create new project success', props<{project: Project}>());
export const createProjectFailure = createAction('[beluga-home] create new project failure', props<{err: any}>());

export const deleteProject = createAction('[beluga-home] delete project', props<{id: string}>());
export const deleteProjectSuccess = createAction('[beluga-home] delete project success');
export const deleteProjectFailure = createAction('[beluga-home] delete project failure', props<{err: any}>());


// domain specifications

export const loadDomainSpecifications = createAction('[beluga-home] load domain specifications');
export const loadDomainSpecificationsSuccess = createAction('[beluga-home] load domain specifications success', props<{domainSpecifications: DomainSpecification[]}>());
export const loadDomainSpecificationsFailure = createAction('[beluga-home] load domain specifications failure', props<{err: any}>());


// services
export const loadServices = createAction('[beluga-home] load  services');
export const loadServicesSuccess = createAction('[beluga-home] load  services success', props<{services: Service[]}>());
export const loadServicesFailure = createAction('[beluga-home] load  services failure',  props<{err: any}>());

// plan properties

export const createPlanProperty = createAction('[beluga-home]  create plan property', props<{planProperty: PlanPropertyOfProject}>());
export const createPlanPropertySuccess = createAction('[beluga-home]  create plan property success', props<{planProperty: PlanProperty}>());
export const createPlanPropertyFailure = createAction('[beluga-home]  create plan property failure', props<{ err: any}>());

export const createDefaultPlanProperties = createAction('[beluga-home]  create default plan properties', props<{project: Project}>());