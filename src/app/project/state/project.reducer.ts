import { createReducer, on } from "@ngrx/store";
import { Project } from "../domain/project";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { demoCreationRunningFailure, demoCreationRunningSuccess, loadDemoPlanPropertiesSuccess, loadPlanProperties, loadPlanPropertiesSuccess, loadProject, loadProjectDemos, loadProjectDemosSuccess, loadProjectSuccess, registerDemoCreation, registerDemoCreationSuccess, loadProjectDemo, updateProject, updateProjectSuccess, loadProjectDemoSuccess } from "./project.actions";
import { Demo } from "src/app/demo/domain/demo";
import { PlanProperty } from "src/app/shared/domain/plan-property/plan-property";
import { Creatable, CreationState } from "src/app/shared/common/creatable.interface";

export interface ProjectState {
    project: Loadable<Project>;
    planProperties: Loadable<Record<string, PlanProperty>>;
    demos: Loadable<Demo[]>;
    demoProperties: Record<string, PlanProperty[]>
    demoCreation: Creatable<String>;
    demo: Loadable<Demo>;
}

export const projectFeature = 'project';

const initialState: ProjectState = {
    project: {state: LoadingState.Initial, data: undefined},
    planProperties: { state: LoadingState.Initial, data: undefined },
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
        demo: null
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
    on(
        loadPlanProperties,
        (state): ProjectState => ({
          ...state,
          planProperties: {
            state: LoadingState.Loading,
            data: state.planProperties.data,
          },
        })
      ),
      on(
        loadPlanPropertiesSuccess,
        (state, { planProperties }): ProjectState => ({
          ...state,
          planProperties: { state: LoadingState.Done, data: planProperties },
        })
    ),
    on(loadProjectDemos, (state): ProjectState => ({
        ...state,
        demos: {state: LoadingState.Loading, data: undefined},
        demo: null
    })),
    on(loadProjectDemosSuccess, (state, {demos}): ProjectState => ({
        ...state,
        demos: {state: LoadingState.Done, data: demos}
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
);