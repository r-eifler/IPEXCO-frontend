import { createReducer, on } from "@ngrx/store";
import { DomainSpecification } from "src/app/global_specification/domain/domain_specification";
import { Service } from "src/app/global_specification/domain/services";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { Project } from "src/app/shared/domain/project";
import {
    loadDomainSpecification,
    loadDomainSpecificationSuccess,
    loadPlans,
    loadPlansSuccess,
    loadProject,
    loadProjectSuccess,
    loadServices,
    loadServicesSuccess,
    selectPlan,
    updateProject,
    updateProjectSuccess
} from "./planning.actions";

export interface PlanningState {
    project: Loadable<Project>;
    domainSpecification: Loadable<DomainSpecification>
    services: Loadable<Service[]>;
    plans: Loadable<any[]>;
    planId: string | null
}


const initialState: PlanningState = {
    project: {state: LoadingState.Initial, data: undefined},
    domainSpecification: {state: LoadingState.Initial, data: undefined},
    services: { state: LoadingState.Initial, data: undefined },
    plans: { state: LoadingState.Initial, data: undefined },
    planId: null
}


export const planningReducer = createReducer(
    initialState,
    on(loadProject, (state): PlanningState => ({
        ...state,
        project: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadProjectSuccess, (state, {project}): PlanningState => ({
        ...state,
        project: {state: LoadingState.Done, data: project}
    })),
    on(updateProject, (state): PlanningState => ({
        ...state,
        project: {state: LoadingState.Loading, data: undefined}
    })),
    on(updateProjectSuccess, (state, {project}): PlanningState => ({
        ...state,
        project: {state: LoadingState.Done, data: project}
    })),
    on(loadDomainSpecification, (state): PlanningState => ({
        ...state,
        domainSpecification: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadDomainSpecificationSuccess, (state, {domainSpecification}): PlanningState => ({
        ...state,
        domainSpecification: {state: LoadingState.Done, data: domainSpecification}
    })),
    on(loadServices, (state): PlanningState => ({
        ...state,
        services: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadServicesSuccess, (state, {services}): PlanningState => ({
        ...state,
        services: {state: LoadingState.Done, data: services}
    })),
    on(loadPlans, (state): PlanningState => ({
        ...state,
        plans: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadPlansSuccess, (state, {plans}): PlanningState => ({
        ...state,
        plans: {state: LoadingState.Done, data: plans}
    })),
    on(selectPlan, (state, {id}): PlanningState => ({
        ...state,
        planId: id
    })),
);