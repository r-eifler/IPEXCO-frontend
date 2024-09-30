import { createReducer, on } from "@ngrx/store";
import { Project } from "src/app/project/domain/project";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { PlanProperty } from "../domain/plan-property/plan-property";
import { loadPlanProperties, loadPlanPropertiesSuccess, loadProject, loadProjectSuccess } from "./iterative-planning.actions";

export interface IterativePlanningState {
    project: Loadable<Project>;
    planProperties: Loadable<PlanProperty[]>
}

export const iterativePlanningFeature = 'iterative-planning';

const initialState: IterativePlanningState = {
    project: {state: LoadingState.Initial, data: undefined},
    planProperties: {state: LoadingState.Initial, data: undefined}
}


export const iterativePlanningReducer = createReducer(
    initialState,
    on(loadProject, (state): IterativePlanningState => ({
        ...state,
        project: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadProjectSuccess, (state, {project}): IterativePlanningState => ({
        ...state,
        project: {state: LoadingState.Done, data: project}
    })),
    on(loadPlanProperties, (state): IterativePlanningState => ({
        ...state,
        planProperties: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadPlanPropertiesSuccess, (state, {planProperties}): IterativePlanningState => ({
        ...state,
        planProperties: {state: LoadingState.Done, data: planProperties}
    })),
);