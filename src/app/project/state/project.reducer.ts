import { createReducer, on } from "@ngrx/store";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { 
    demoCreationRunningFailure, 
    demoCreationRunningSuccess, 
    loadDemoPlanPropertiesSuccess, 
    loadPlanProperties, 
    loadPlanPropertiesSuccess, 
    loadProject, 
    loadProjectDemos, 
    loadProjectDemosSuccess, 
    loadProjectSuccess, 
    registerDemoCreation, 
    registerDemoCreationSuccess, 
    loadProjectDemo, 
    updateProject, 
    updateProjectSuccess, 
    loadProjectDemoSuccess, 
    updateDemoSuccess, 
    loadPrompts, 
    loadPromptsSuccess, 
    loadOutputSchemas, 
    loadOutputSchemasSuccess, 
    loadDomainSpecification, 
    loadDomainSpecificationSuccess, 
    loadServices,
    loadServicesSuccess
} from "./project.actions";
import { PlanProperty } from "src/app/shared/domain/plan-property/plan-property";
import { Creatable, CreationState } from "src/app/shared/common/creatable.interface";
import { Project } from "src/app/shared/domain/project";
import { OutputSchema, Prompt } from "src/app/global_specification/domain/prompt";
import { DomainSpecification } from "src/app/global_specification/domain/domain_specification";
import { Service } from "src/app/global_specification/domain/services";
import { Demo } from "src/app/shared/domain/demo";

export interface ProjectState {
    project: Loadable<Project>;
    domainSpecification: Loadable<DomainSpecification>
    planProperties: Loadable<Record<string, PlanProperty>>;
    services: Loadable<Service[]>;
    prompts: Loadable<Prompt[]>;
    outputSchemas: Loadable<OutputSchema[]>;
    demos: Loadable<Demo[]>;
    demoProperties: Record<string, PlanProperty[]>
    demoCreation: Creatable<String>;
    demo: Loadable<Demo>;
}


const initialState: ProjectState = {
    project: {state: LoadingState.Initial, data: undefined},
    domainSpecification: {state: LoadingState.Initial, data: undefined},
    planProperties: { state: LoadingState.Initial, data: undefined },
    services: { state: LoadingState.Initial, data: undefined },
    prompts: { state: LoadingState.Initial, data: undefined },
    outputSchemas: { state: LoadingState.Initial, data: undefined },
    demos: {state: LoadingState.Initial, data: undefined},
    demoCreation: {state: CreationState.Default, data: undefined},
    demoProperties: {},
    demo: {state: LoadingState.Initial, data: undefined},
}


export const projectReducer = createReducer(
    initialState,
    on(loadProject, (state): ProjectState => ({
        ...state,
        project: {state: LoadingState.Loading, data: undefined},
        demo: {state: LoadingState.Initial, data: undefined},
    })),
    on(loadProjectSuccess, (state, {project}): ProjectState => ({
        ...state,
        project: {state: LoadingState.Done, data: project}
    })),
    on(updateProject, (state): ProjectState => ({
        ...state,
        project: {state: LoadingState.Loading, data: undefined}
    })),
    on(updateProjectSuccess, (state, {project}): ProjectState => ({
        ...state,
        project: {state: LoadingState.Done, data: project}
    })),
    on(loadDomainSpecification, (state): ProjectState => ({
        ...state,
        domainSpecification: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadDomainSpecificationSuccess, (state, {domainSpecification}): ProjectState => ({
        ...state,
        domainSpecification: {state: LoadingState.Done, data: domainSpecification}
    })),
    on(loadPlanProperties, (state): ProjectState => ({
        ...state,
        planProperties: {
        state: LoadingState.Loading,
        data: state.planProperties.data,
        },
    })),
    on(loadPlanPropertiesSuccess,(state, { planProperties }): ProjectState => ({
            ...state,
            planProperties: { state: LoadingState.Done, data: planProperties },
        })
    ),
    on(loadServices, (state): ProjectState => ({
        ...state,
        services: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadServicesSuccess, (state, {services}): ProjectState => ({
        ...state,
        services: {state: LoadingState.Done, data: services}
    })),
    on(loadPrompts, (state): ProjectState => ({
        ...state,
        prompts: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadPromptsSuccess, (state, {prompts}): ProjectState => ({
        ...state,
        prompts: {state: LoadingState.Done, data: prompts}
    })),
    on(loadOutputSchemas, (state): ProjectState => ({
        ...state,
        outputSchemas: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadOutputSchemasSuccess, (state, {outputSchemas}): ProjectState => ({
        ...state,
        outputSchemas: {state: LoadingState.Done, data: outputSchemas}
    })),
    on(loadProjectDemos, (state): ProjectState => ({
        ...state,
        demos: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadProjectDemosSuccess, (state, {demos}): ProjectState => ({
        ...state,
        demos: {state: LoadingState.Done, data: demos},
        demo: state?.demo.state == LoadingState.Done ?
            {state: LoadingState.Done, data: demos.find(demo => demo._id == state.demo.data._id)} :
            {state: LoadingState.Initial, data: undefined}
    })),
    on(registerDemoCreation, (state, {demo}): ProjectState => ({
        ...state,
        demoCreation: {state: CreationState.Pending, data: undefined}
    })),
    on(registerDemoCreationSuccess, (state, {id}): ProjectState => ({
        ...state,
        demoCreation: {state: CreationState.Pending, data: id}
    })),
    on(demoCreationRunningSuccess, (state): ProjectState => ({
        ...state,
        demoCreation: {state: CreationState.Default, data: undefined}
    })),
    on(demoCreationRunningFailure, (state): ProjectState => ({
        ...state,
        demoCreation: {state: CreationState.Default, data: undefined}
    })),
    on(loadDemoPlanPropertiesSuccess, (state,{demoId, planProperties}): ProjectState => ({
        ...state,
        demoProperties: {...state.demoProperties, [demoId]: planProperties}
    })),
    on(loadProjectDemo, (state): ProjectState => ({
        ...state,
        demo: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadProjectDemoSuccess, (state, {demo}): ProjectState => ({
        ...state,
        demo: {state: LoadingState.Done, data: demo},
    })),
    on(updateDemoSuccess, (state, {demo}): ProjectState => ({
        ...state,
        demo: {state: LoadingState.Done, data: demo},
    })),
);