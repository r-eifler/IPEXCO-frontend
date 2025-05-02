import { createAction, props } from "@ngrx/store";
import { DomainSpecification } from "src/app/global_specification/domain/domain_specification";
import { Service } from "src/app/global_specification/domain/services";
import { Project } from "src/app/shared/domain/project";
import { Plan, PlanBase } from "../domain/plan";

// project

export const loadProject = createAction('[planning]load project', props<{id: string}>());
export const loadProjectSuccess = createAction('[planning]load project success', props<{project: Project}>());
export const loadProjectFailure = createAction('[planning]load project failure',  props<{err: any}>());


export const updateProject = createAction('[planning]update project', props<{project: Project}>());
export const updateProjectSuccess = createAction('[planning]update project success', props<{project: Project}>());
export const updateProjectFailure = createAction('[planning]update project failure',  props<{err: any}>());

// domain spec
export const loadDomainSpecification = createAction('[planning] load  domain specification', props<{id: string}>());
export const loadDomainSpecificationSuccess = createAction('[planning] load  domain specification success', props<{domainSpecification: DomainSpecification}>());
export const loadDomainSpecificationFailure = createAction('[planning] load  domain specification failure',  props<{err: any}>());

export const loadDomainSpecifications = createAction('[planning] load domain specifications');
export const loadDomainSpecificationsSuccess = createAction('[planning] load domain specifications success', props<{domainSpecifications: DomainSpecification[]}>());
export const loadDomainSpecificationsFailure = createAction('[planning] load domain specifications failure', props<{err: any}>());


// services
export const loadServices = createAction('[planning]load  services');
export const loadServicesSuccess = createAction('[planning]load  services success', props<{services: Service[]}>());
export const loadServicesFailure = createAction('[planning]load  services failure',  props<{err: any}>());


// plan

export const loadPlans = createAction('[planning] load plans', props<{id: string}>());
export const loadPlansSuccess = createAction('[planning] load plans success', props<{plans: Plan[]}>());
export const loadPlansFailure = createAction('[planning] load plans failure',  props<{err: any}>());

export const selectPlan = createAction('[planning] select plan', props<{id: string}>());
export const selectPlanRef = createAction('[planning] select reference plan', props<{id: string}>());
export const selectPlanComp = createAction('[planning] select compare plan', props<{id: string}>());

export const registerPlanComputation = createAction('[planning] register plan computation', props<{plan: PlanBase}>());
export const registerPlanComputationSuccess = createAction('[planning] register plan computation success', props<{plan: Plan}>());
export const registerPlanComputationFailure = createAction('[planning] register plan computation failure',  props<{err: any}>());

export const planComputationFinishedSuccess = createAction('[planning] plan computation finished success', props<{id: string}>());
export const planComputationFinishedFailure = createAction('[planning] plan computation finished failure',  props<{err: any}>());


export const cancelPlanComputation = createAction('[planning] cancel plan computation', props<{id: string}>());
export const cancelPlanComputationSuccess = createAction('[planning] cancel plan computation success', props<{canceled: boolean}>());
export const cancelPlanComputationFailure = createAction('[planning] cancel plan computation failure',  props<{err: any}>());


