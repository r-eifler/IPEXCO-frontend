import { createReducer, on } from "@ngrx/store";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { Project } from "src/app/shared/domain/project";
import { BelugaProblem, BelugaProblemZ } from "../../shared/domain/beluga_problem";
import { BelugaConfiguration, FlightPlanTree, FlightSection } from "../domain/flight-section";
import { loadDomainSpecification, loadDomainSpecificationSuccess, loadFlightPlanTree, loadFlightPlanTreeSuccess, loadFlightSections, loadFlightSectionsSuccess, loadProject, loadProjectSuccess, loadServices, loadServicesSuccess, newConfiguration, reloadFlightPlanTreeSuccess, selectSection, skipIncomingJig, skipOutgoingJigType, skipProductionJig, updateEmptyRacks, updateFlightPlanTreeSuccess, updateFlightSchedule, updateHangarStatus, updateMaxSwaps, updateProductionSchedule, updateRackStatus, updateTrailerStatus } from "./flight-section-planning.actions";
import { BelugaState, getInitialState } from "../../shared/domain/beluga_state";
import { DomainSpecification } from "src/app/global_specification/domain/domain_specification";
import { Service } from "src/app/global_specification/domain/services";
import { ExplanationRunStatus } from "src/app/iterative_planning/domain/explanation/explanations";

export interface FlightSectionPlanningState {
    project: Loadable<Project>;
    task: Loadable<BelugaProblem>;
    initialState: Loadable<BelugaState>;
    domainSpecification: Loadable<DomainSpecification>
    services: Loadable<Service[]>;
    tree: Loadable<FlightPlanTree | null>;
    sections: Loadable<Record<string,FlightSection>>;
    selectedSectionId: null | string;
    updatedConfiguration: BelugaConfiguration | null;
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
    updatedConfiguration: null
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
        updatedConfiguration: state.selectedSectionId !== null ? 
            {
                ...sections[state.selectedSectionId].configurations[sections[state.selectedSectionId].configurationIndex],
                explanations: null,
                explanationStatus: ExplanationRunStatus.PENDING
            } : null
    })),
    on(selectSection, (state, {id}): FlightSectionPlanningState => ({
        ...state,
        selectedSectionId: id
    })),


    on(newConfiguration, (state): FlightSectionPlanningState => ({
        ...state,
        updatedConfiguration: state.selectedSectionId !== null && state.sections.data !== undefined ? 
            {
                ...state.sections.data[state.selectedSectionId].configurations[state.sections.data[state.selectedSectionId].configurationIndex],
                explanations: null,
                explanationStatus: ExplanationRunStatus.PENDING
            } : null
    })),
    on(skipIncomingJig, (state, {index, skip}): FlightSectionPlanningState => {
        if(state.updatedConfiguration === null){
            return state
        }

        const newConfig: BelugaConfiguration = {...state.updatedConfiguration};
        newConfig.flightTargetSchedule.incoming[index].skip = skip

        return {
            ...state,
            updatedConfiguration: newConfig
        }
    }),
    on(skipOutgoingJigType, (state, {index, skip}): FlightSectionPlanningState => {
        if(state.updatedConfiguration === null){
            return state
        }

        const newConfig: BelugaConfiguration = {...state.updatedConfiguration};
        newConfig.flightTargetSchedule.outgoing[index].skip = skip

        return {
            ...state,
            updatedConfiguration: newConfig
        }
    }),
    on(skipProductionJig, (state, {productionLineName, index, skip}): FlightSectionPlanningState => {
        if(state.updatedConfiguration === null){
            return state
        }

        const newConfig: BelugaConfiguration = {...state.updatedConfiguration};
        newConfig.productionLinesTargetSchedule[productionLineName].schedule[index].skip = skip

        return {
            ...state,
            updatedConfiguration: newConfig
        }
    }),
    on(updateRackStatus, (state, {index, status}): FlightSectionPlanningState => {
        if(state.updatedConfiguration === null){
            return state
        }

        const newConfig: BelugaConfiguration = {...state.updatedConfiguration};
        newConfig.siteSetUp.racks[index].status = status;

        return {
            ...state,
            updatedConfiguration: newConfig
        }
    }),
    on(updateTrailerStatus, (state, {index, side, status}): FlightSectionPlanningState => {
        if(state.updatedConfiguration === null){
            return state
        }

        const newConfig: BelugaConfiguration = {...state.updatedConfiguration};
        if(side === 'bside'){
            newConfig.siteSetUp.belugaTrailers[index].status = status;
        }
        if(side === 'fside'){
            newConfig.siteSetUp.factoryTrailers[index].status = status;
        }
        
        return {
            ...state,
            updatedConfiguration: newConfig
        }
    }),
    on(updateHangarStatus, (state, {index, status}): FlightSectionPlanningState => {
        if(state.updatedConfiguration === null){
            return state
        }

        const newConfig: BelugaConfiguration = {...state.updatedConfiguration};
        newConfig.siteSetUp.hangars[index].status = status;

        return {
            ...state,
            updatedConfiguration: newConfig
        }
    }),
    on(updateFlightSchedule, (state, {schedule}): FlightSectionPlanningState => {
        if(state.updatedConfiguration === null){
            return state
        }

        return {
            ...state,
            updatedConfiguration: {
                ...state.updatedConfiguration,
                flightTargetSchedule: schedule
            }
        }
    }),
    on(updateProductionSchedule, (state, {schedule}): FlightSectionPlanningState => {
        if(state.updatedConfiguration === null){
            return state
        }

        return {
            ...state,
            updatedConfiguration: {
                ...state.updatedConfiguration,
                productionLinesTargetSchedule: schedule
            }
        }
    }),
    on(updateMaxSwaps, (state, {value}): FlightSectionPlanningState => {
        if(state.updatedConfiguration === null){
            return state
        }

        return {
            ...state,
            updatedConfiguration: {
                ...state.updatedConfiguration,
                maxSwaps: value
            }
        }
    }),
    on(updateEmptyRacks, (state, {value}): FlightSectionPlanningState => {
        if(state.updatedConfiguration === null){
            return state
        }

        return {
            ...state,
            updatedConfiguration: {
                ...state.updatedConfiguration,
                minEmptyRacks: value
            }
        }
    }),
);
