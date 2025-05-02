import { createReducer, on } from "@ngrx/store";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { Project } from "src/app/shared/domain/project";
import { BelugaProblem, BelugaProblemZ } from "../../shared/domain/beluga_problem";
import { FlightPlanTree, FlightSection } from "../domain/flight-section";
import { loadDomainSpecification, loadDomainSpecificationSuccess, loadFlightPlanTree, loadFlightPlanTreeSuccess, loadFlightSections, loadFlightSectionsSuccess, loadProject, loadProjectSuccess, loadServices, loadServicesSuccess, reloadFlightPlanTreeSuccess, selectSection, updateFlightPlanTreeSuccess } from "./flight-section-planning.actions";
import { BelugaState, getInitialState } from "../../shared/domain/beluga_state";
import { DomainSpecification } from "src/app/global_specification/domain/domain_specification";
import { Service } from "src/app/global_specification/domain/services";

export interface FlightSectionPlanningState {
    project: Loadable<Project>;
    task: Loadable<BelugaProblem>;
    initialState: Loadable<BelugaState>;
    domainSpecification: Loadable<DomainSpecification>
    services: Loadable<Service[]>;
    tree: Loadable<FlightPlanTree | null>;
    sections: Loadable<Record<string,FlightSection>>;
    selectedSectionId: null | string;
}


const initialState: FlightSectionPlanningState = {
    project: {state: LoadingState.Initial, data: undefined},
    task: {state: LoadingState.Initial, data: undefined},
    initialState: {state: LoadingState.Initial, data: undefined},
    domainSpecification: {state: LoadingState.Initial, data: undefined},
    services: { state: LoadingState.Initial, data: undefined },
    tree: {state: LoadingState.Initial, data: undefined},
    sections: {state: LoadingState.Initial, data: undefined},
    selectedSectionId: null,
}


export const FlightSectionPlanningReducer = createReducer(
    initialState,
    on(loadProject, (state): FlightSectionPlanningState => ({
        ...state,
        project: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadProjectSuccess, (state, {project}): FlightSectionPlanningState => {
        const task = BelugaProblemZ.parse(project?.baseTask?.model);
        return {
            ...state,
            project: {state: LoadingState.Done, data: project},
            task: {state: LoadingState.Done, data: task},
            initialState: {state: LoadingState.Done, data: getInitialState(task)},
        }
    }),
    on(loadDomainSpecification, (state): FlightSectionPlanningState => ({
        ...state,
        domainSpecification: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadDomainSpecificationSuccess, (state, {domainSpecification}): FlightSectionPlanningState => ({
        ...state,
        domainSpecification: {state: LoadingState.Done, data: domainSpecification}
    })),
    on(loadServices, (state): FlightSectionPlanningState => ({
        ...state,
        services: {state: LoadingState.Loading, data: undefined}
    })),
    on(loadServicesSuccess, (state, {services}): FlightSectionPlanningState => ({
        ...state,
        services: {state: LoadingState.Done, data: services}
    })),
    on(loadFlightPlanTree, (state): FlightSectionPlanningState => ({
        ...state,
        tree: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadFlightPlanTreeSuccess, (state, {tree}): FlightSectionPlanningState => ({
        ...state,
        tree: {state: LoadingState.Done, data: tree},
    })),
    on(reloadFlightPlanTreeSuccess, (state, {tree}): FlightSectionPlanningState => ({
        ...state,
        tree: {state: LoadingState.Done, data: tree},
    })),
    on(updateFlightPlanTreeSuccess, (state, {tree}): FlightSectionPlanningState => ({
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
    on(selectSection, (state, {id}): FlightSectionPlanningState => ({
        ...state,
        selectedSectionId: id
    })),
);