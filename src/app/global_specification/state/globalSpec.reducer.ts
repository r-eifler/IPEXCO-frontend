import { createReducer, on } from "@ngrx/store";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { DomainSpecification } from "../domain/domain_specification";
import { OutputSchema, Prompt } from "../domain/prompt";
import { 
    loadDomainSpecification, 
    loadDomainSpecifications, 
    loadDomainSpecificationsSuccess, 
    loadDomainSpecificationSuccess, 
    loadOutputSchema, 
    loadOutputSchemas, 
    loadOutputSchemasSuccess, 
    loadOutputSchemaSuccess, 
    loadPrompt, 
    loadPrompts, 
    loadPromptsSuccess, 
    loadPromptSuccess, 
    loadServices, 
    loadServicesSuccess 
} from "./globalSpec.actions";
import { Service } from "../domain/services";


export interface GlobalSpecificationState {
    domainSpecifications: Loadable<DomainSpecification[]>;
    domainSpecification: Loadable<DomainSpecification>;
    prompts: Loadable<Prompt[]>;
    prompt: Loadable<Prompt>;
    outputSchemas: Loadable<OutputSchema[]>;
    outputSchema: Loadable<OutputSchema>;
    services: Loadable<Service[]>;
}


const initialState: GlobalSpecificationState = {
    domainSpecifications: {state: LoadingState.Initial, data: undefined},
    domainSpecification: {state: LoadingState.Initial, data: undefined},
    prompts: {state: LoadingState.Initial, data: undefined},
    prompt: {state: LoadingState.Initial, data: undefined},
    outputSchemas: {state: LoadingState.Initial, data: undefined},
    outputSchema: {state: LoadingState.Initial, data: undefined},
    services: {state: LoadingState.Initial, data: undefined},
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
    on(loadDomainSpecification, (state): GlobalSpecificationState => ({
        ...state,
        domainSpecification: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadDomainSpecificationSuccess, (state, {domainSpecification}): GlobalSpecificationState => ({
        ...state,
        domainSpecification: {state: LoadingState.Done, data: domainSpecification},
    })),
    on(loadPrompts, (state): GlobalSpecificationState => ({
        ...state,
        prompts: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadPromptsSuccess, (state, {prompts}): GlobalSpecificationState => ({
        ...state,
        prompts: {state: LoadingState.Done, data: prompts},
    })),
    on(loadPrompt, (state): GlobalSpecificationState => ({
        ...state,
        prompt: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadPromptSuccess, (state, {prompt}): GlobalSpecificationState => ({
        ...state,
        prompt: {state: LoadingState.Done, data: prompt},
    })),
    on(loadOutputSchemas, (state): GlobalSpecificationState => ({
        ...state,
        outputSchemas: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadOutputSchemasSuccess, (state, {outputSchemas}): GlobalSpecificationState => ({
        ...state,
        outputSchemas: {state: LoadingState.Done, data: outputSchemas},
    })),
    on(loadOutputSchema, (state): GlobalSpecificationState => ({
        ...state,
        outputSchema: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadOutputSchemaSuccess, (state, {outputSchema}): GlobalSpecificationState => ({
        ...state,
        outputSchema: {state: LoadingState.Done, data: outputSchema},
    })),
    on(loadServices, (state): GlobalSpecificationState => ({
        ...state,
        services: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadServicesSuccess, (state, {services}): GlobalSpecificationState => ({
        ...state,
        services: {state: LoadingState.Done, data: services},
    })),
);