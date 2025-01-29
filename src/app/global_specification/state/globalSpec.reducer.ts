import { createReducer, on } from "@ngrx/store";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { DomainSpecification } from "../domain/domain_specification";
import { Prompt } from "../domain/prompt";
import { Explainer, Planner } from "../domain/services";
import { loadDomainSpecifications, loadDomainSpecificationsSuccess, loadExplainers, loadExplainersSuccess, loadPlanners, loadPlannersSuccess, loadPrompts, loadPromptsSuccess } from "./globalSpec.actions";


export interface GlobalSpecificationState {
    domainSpecifications: Loadable<DomainSpecification[]>;
    prompts: Loadable<Prompt[]>;
    planner: Loadable<Planner[]>;
    explainer: Loadable<Explainer[]>;
}

export const globalSpecificationFeature = 'global-specification';

const initialState: GlobalSpecificationState = {
    domainSpecifications: {state: LoadingState.Initial, data: undefined},
    prompts: {state: LoadingState.Initial, data: undefined},
    planner: {state: LoadingState.Initial, data: undefined},
    explainer: {state: LoadingState.Initial, data: undefined},
}


export const globalSpecificationReducer = createReducer(
    initialState,
    on(loadDomainSpecifications, (state): GlobalSpecificationState => ({
        ...state,
        domainSpecifications: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadDomainSpecificationsSuccess, (state, {domainSpecifications}): GlobalSpecificationState => ({
        ...state,
        domainSpecifications: {state: LoadingState.Done, data: domainSpecifications},
    })),
    on(loadPrompts, (state): GlobalSpecificationState => ({
        ...state,
        prompts: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadPromptsSuccess, (state, {prompts}): GlobalSpecificationState => ({
        ...state,
        prompts: {state: LoadingState.Done, data: prompts},
    })),
    on(loadPlanners, (state): GlobalSpecificationState => ({
        ...state,
        planner: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadPlannersSuccess, (state, {planners}): GlobalSpecificationState => ({
        ...state,
        planner: {state: LoadingState.Done, data: planners},
    })),
    on(loadExplainers, (state): GlobalSpecificationState => ({
        ...state,
        explainer: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadExplainersSuccess, (state, {explainers}): GlobalSpecificationState => ({
        ...state,
        explainer: {state: LoadingState.Done, data: explainers},
    })),
);