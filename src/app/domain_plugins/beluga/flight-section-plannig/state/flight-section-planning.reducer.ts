import { createReducer, on } from "@ngrx/store";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { Project } from "src/app/shared/domain/project";
import { BelugaProblem, BelugaProblemZ } from "../../shared/domain/beluga_problem";
import { FlightPlanTree, FlightSection } from "../domain/flight-section";
import { loadFlightPlanTree, loadFlightPlanTreeSuccess, loadFlightSections, loadFlightSectionsSuccess, loadProject, loadProjectSuccess } from "./flight-section-planning.actions";

export interface FlightSectionPlanningState {
    project: Loadable<Project>;
    task: Loadable<BelugaProblem>;
    tree: Loadable<FlightPlanTree | null>;
    sections: Loadable<Record<string,FlightSection>>;
}


const initialState: FlightSectionPlanningState = {
    project: {state: LoadingState.Initial, data: undefined},
    task: {state: LoadingState.Initial, data: undefined},
    tree: {state: LoadingState.Initial, data: undefined},
    sections: {state: LoadingState.Initial, data: undefined},
}


export const FlightSectionPlanningReducer = createReducer(
    initialState,
    on(loadProject, (state): FlightSectionPlanningState => ({
        ...state,
        project: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadProjectSuccess, (state, {project}): FlightSectionPlanningState => ({
        ...state,
        project: {state: LoadingState.Done, data: project},
        task:   {state: LoadingState.Done, data: BelugaProblemZ.parse(project?.baseTask?.model)}
    })),
    on(loadFlightPlanTree, (state): FlightSectionPlanningState => ({
        ...state,
        tree: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadFlightPlanTreeSuccess, (state, {tree}): FlightSectionPlanningState => ({
        ...state,
        tree: {state: LoadingState.Done, data: tree},
    })),
    on(loadFlightSections, (state): FlightSectionPlanningState => ({
        ...state,
        sections: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadFlightSectionsSuccess, (state, {sections}): FlightSectionPlanningState => ({
        ...state,
        sections: {state: LoadingState.Done, data: sections},
    })),
);