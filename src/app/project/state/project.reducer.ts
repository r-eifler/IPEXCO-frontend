import { createReducer, on } from "@ngrx/store";
import { Project } from "../domain/project";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { loadPlanProperties, loadPlanPropertiesSuccess, loadProject, loadProjectDemos, loadProjectDemosSuccess, loadProjectSuccess, updateProject, updateProjectSuccess } from "./project.actions";
import { Demo } from "src/app/interface/demo";
import { PlanProperty } from "src/app/iterative_planning/domain/plan-property/plan-property";

export interface ProjectState {
    project: Loadable<Project>;
    planProperties: Loadable<Record<string, PlanProperty>>;
    demos: Loadable<Demo[]>
}

export const projectFeature = 'project';

const initialState: ProjectState = {
    project: {state: LoadingState.Initial, data: undefined},
    planProperties: { state: LoadingState.Initial, data: undefined },
    demos: {state: LoadingState.Initial, data: undefined}
}


export const projectReducer = createReducer(
    initialState,
    on(loadProject, (state): ProjectState => ({
        ...state,
        project: {state: LoadingState.Loading, data: undefined}
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
        demos: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadProjectDemosSuccess, (state, {demos}): ProjectState => ({
        ...state,
        demos: {state: LoadingState.Done, data: demos}
    })),
);