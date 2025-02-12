import { createReducer, on } from "@ngrx/store";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { Demo } from "src/app/project/domain/demo";
import { PlanProperty } from "src/app/shared/domain/plan-property/plan-property";
import { loadDemos, loadDemosSuccess, loadDemoPlanPropertiesSuccess, loadDemo, loadDemoSuccess, loadOutputSchemas, loadOutputSchemasSuccess, loadServices, loadServicesSuccess, loadPrompts, loadPromptsSuccess, loadDomainSpecification, loadDomainSpecificationSuccess } from "./demo.actions";
import { OutputSchema, Prompt } from "src/app/global_specification/domain/prompt";
import { Service } from "src/app/global_specification/domain/services";
import { DomainSpecification } from "src/app/global_specification/domain/domain_specification";


export interface DemoState {
    demos: Loadable<Demo[]>;
    demoProperties: Record<string, PlanProperty[]>
    demo: Loadable<Demo>;
    domainSpecification: Loadable<DomainSpecification>,
    services: Loadable<Service[]>;
    prompts: Loadable<Prompt[]>;
    outputSchemas: Loadable<OutputSchema[]>;
}

const initialState: DemoState = {
    demos: {state: LoadingState.Initial, data: undefined},
    demoProperties: {},
    demo: {state: LoadingState.Initial, data: undefined},
    domainSpecification: {state: LoadingState.Initial, data: undefined},
    services: { state: LoadingState.Initial, data: undefined },
    prompts: { state: LoadingState.Initial, data: undefined },
    outputSchemas: { state: LoadingState.Initial, data: undefined },
}


export const demoReducer = createReducer(
    initialState,
    on(loadDemos, (state): DemoState => ({
        ...state,
        demos: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadDemosSuccess, (state, {demos}): DemoState => ({
        ...state,
        demos: {state: LoadingState.Done, data: demos},
        demo: state?.demo.state == LoadingState.Done ?
            {state: LoadingState.Done, data: demos.find(demo => demo._id == state.demo.data._id)} :
            {state: LoadingState.Initial, data: undefined}
    })),
    on(loadDemoPlanPropertiesSuccess, (state,{demoId, planProperties}): DemoState => ({
        ...state,
        demoProperties: {...state.demoProperties, [demoId]: planProperties}
    })),
    on(loadDemo, (state): DemoState => ({
        ...state,
        demo: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadDemoSuccess, (state, {demo}): DemoState => ({
        ...state,
        demo: {state: LoadingState.Done, data: demo},
    })),
    on(loadDomainSpecification, (state): DemoState => ({
        ...state,
        domainSpecification: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadDomainSpecificationSuccess, (state, {domainSpecification}): DemoState => ({
        ...state,
        domainSpecification: {state: LoadingState.Done, data: domainSpecification}
    })),
    on(loadServices, (state): DemoState => ({
        ...state,
        services: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadServicesSuccess, (state, {services}): DemoState => ({
        ...state,
        services: {state: LoadingState.Done, data: services}
    })),
    on(loadPrompts, (state): DemoState => ({
        ...state,
        prompts: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadPromptsSuccess, (state, {prompts}): DemoState => ({
        ...state,
        prompts: {state: LoadingState.Done, data: prompts}
    })),
    on(loadOutputSchemas, (state): DemoState => ({
        ...state,
        outputSchemas: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadOutputSchemasSuccess, (state, {outputSchemas}): DemoState => ({
        ...state,
        outputSchemas: {state: LoadingState.Done, data: outputSchemas}
    })),
);

