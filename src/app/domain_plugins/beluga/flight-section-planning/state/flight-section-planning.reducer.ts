import { createReducer, on } from "@ngrx/store";
import { DomainSpecification } from "src/app/global_specification/domain/domain_specification";
import { Service } from "src/app/global_specification/domain/services";
import { ExplanationRunStatus } from "src/app/iterative_planning/domain/explanation/explanations";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { Project } from "src/app/shared/domain/project";
import { BelugaProblem, BelugaProblemZ } from "../../shared/domain/beluga_problem";
import { BelugaState, getInitialState } from "../../shared/domain/beluga_state";
import { BelugaConfiguration, FlightPlanTree, FlightsHorizon } from "../domain/flight-section";
import { loadDomainSpecification, loadDomainSpecificationSuccess, loadFlightPlanTree, loadFlightPlanTreeSuccess, loadFlightsHorizons, loadFlightsHorizonsSuccess, loadProject, loadProjectSuccess, loadServices, loadServicesSuccess, newConfiguration, reloadFlightPlanTreeSuccess, selectConfiguration, selectSection, skipIncomingJig, skipOutgoingJigType, skipProductionJig, updateConfigurationOfSectionAndConfigIndex, updateEmptyRacks, updateFlightPlanTreeSuccess, updateHangarStatus, updateMaxSwaps, updateRackStatus, updateTrailerStatus } from "./flight-section-planning.actions";

export interface FlightSectionPlanningState {
    project: Loadable<Project>;
    task: Loadable<BelugaProblem>;
    initialState: Loadable<BelugaState>;
    domainSpecification: Loadable<DomainSpecification>
    services: Loadable<Service[]>;
    tree: Loadable<FlightPlanTree | null>;
    sections: Loadable<Record<string,FlightsHorizon>>;
    selectedSectionId: null | string;
    selectedConfigIndex: null | number;
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
    selectedConfigIndex: null,
    updatedConfiguration: null
}


export const FlightSectionPlanningReducer = createReducer(
    initialState,
    on(loadProject, (state): FlightSectionPlanningState => ({
        project: {state: LoadingState.Loading, data: undefined},
        task: {state: LoadingState.Initial, data: undefined},
        initialState: {state: LoadingState.Initial, data: undefined},
        domainSpecification: {state: LoadingState.Initial, data: undefined},
        services: { state: LoadingState.Initial, data: undefined },
        tree: {state: LoadingState.Initial, data: undefined},
        sections: {state: LoadingState.Initial, data: undefined},
        selectedSectionId: null,
        selectedConfigIndex: null,
        updatedConfiguration: null
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
        tree: state.project.data !== undefined && state.project.data._id == tree.project ? 
            {state: LoadingState.Done, data: tree} : state.tree,
    })),
    on(loadFlightsHorizons, (state): FlightSectionPlanningState => ({
        ...state,
        sections: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadFlightsHorizonsSuccess, (state, {sections}): FlightSectionPlanningState => ({
        ...state,
        sections: {state: LoadingState.Done, data: sections}
    })),
    on(selectSection, (state, {id}): FlightSectionPlanningState => ({
        ...state,
        selectedSectionId: id
    })),
    on(selectConfiguration, (state, {index}): FlightSectionPlanningState => ({
        ...state,
        selectedConfigIndex: index
    })),


    on(newConfiguration, (state): FlightSectionPlanningState => ({
        ...state,
        updatedConfiguration: state.selectedSectionId !== null && state.selectedConfigIndex !== null && state.sections.data !== undefined ? 
            {
                ...state.sections.data[state.selectedSectionId].configurations[state.selectedConfigIndex],
                explanations: null,
                explanationStatus: ExplanationRunStatus.PENDING
            } : null
    })),
    on(updateConfigurationOfSectionAndConfigIndex, (state, {section, index}): FlightSectionPlanningState => ({
        ...state,
        selectedSectionId: section._id,
        selectedConfigIndex: index,
        updatedConfiguration: state.sections.data !== undefined? 
            {
                ...state.sections.data?.[section._id].configurations[index],
                explanations: null,
                explanationStatus: ExplanationRunStatus.PENDING
            } : null
    })),
    on(skipIncomingJig, (state, {flightIndex, index, skip}): FlightSectionPlanningState =>  ({
        ...state,
        updatedConfiguration: state.updatedConfiguration !== null ? {
            ...state.updatedConfiguration,
            flightTargetSchedule: {
                ...state.updatedConfiguration.flightTargetSchedule,
                [flightIndex]: {
                    ...state.updatedConfiguration.flightTargetSchedule[flightIndex],
                    incoming: [
                        ...state.updatedConfiguration.flightTargetSchedule[flightIndex].incoming.slice(0,index),
                        {
                            ...state.updatedConfiguration.flightTargetSchedule[flightIndex].incoming[index],
                            skip
                        },
                        ...state.updatedConfiguration.flightTargetSchedule[flightIndex].incoming.slice(index + 1),
                    ]
            }}
        } : null
        
    })),
    on(skipOutgoingJigType, (state, {flightIndex, index, skip}): FlightSectionPlanningState => ({
        ...state,
        updatedConfiguration: state.updatedConfiguration !== null ? {
            ...state.updatedConfiguration,
            flightTargetSchedule: {
                ...state.updatedConfiguration.flightTargetSchedule,
                [flightIndex]: {
                    ...state.updatedConfiguration.flightTargetSchedule[flightIndex],
                    outgoing: [
                        ...state.updatedConfiguration.flightTargetSchedule[flightIndex].outgoing.slice(0,index),
                        {
                            ...state.updatedConfiguration.flightTargetSchedule[flightIndex].outgoing[index],
                            skip
                        },
                        ...state.updatedConfiguration.flightTargetSchedule[flightIndex].outgoing.slice(index + 1),
                    ]
            }}
        } : null
        
    })),
    on(skipProductionJig, (state, {productionLineName, index, skip}): FlightSectionPlanningState => ({
        ...state,
        updatedConfiguration: state.updatedConfiguration !== null ? {
            ...state.updatedConfiguration,
            productionLinesTargetSchedule: {
                ...state.updatedConfiguration.productionLinesTargetSchedule,
                [productionLineName]: {
                    ...state.updatedConfiguration.productionLinesTargetSchedule[productionLineName],
                    schedule: [
                        ...state.updatedConfiguration.productionLinesTargetSchedule[productionLineName].schedule.slice(0,index),
                        {
                            ...state.updatedConfiguration.productionLinesTargetSchedule[productionLineName].schedule[index],
                            skip
                        },
                        ...state.updatedConfiguration.productionLinesTargetSchedule[productionLineName].schedule.slice(index + 1)
                    ]
                },
            }
        } : null
        
    })),
    on(updateRackStatus, (state, {index, status}): FlightSectionPlanningState => ({
        ...state,
        updatedConfiguration: state.updatedConfiguration !== null ? {
            ...state.updatedConfiguration,
            siteSetUp: {
                ...state.updatedConfiguration.siteSetUp,
                racks: [
                    ...state.updatedConfiguration.siteSetUp.racks.slice(0,index),
                    {
                        ...state.updatedConfiguration.siteSetUp.racks[index],
                        status
                    },
                    ...state.updatedConfiguration.siteSetUp.racks.slice(index + 1),
                ]
            }
        } : null
        
    })),
    on(updateTrailerStatus, (state, {index, side, status}): FlightSectionPlanningState => {
        if(state.updatedConfiguration === null){
            return state
        }

        if(side === 'bside'){
            return {
                ...state,
                updatedConfiguration: {
                    ...state.updatedConfiguration,
                    siteSetUp: {
                        ...state.updatedConfiguration.siteSetUp,
                        belugaTrailers: [
                            ...state.updatedConfiguration.siteSetUp.belugaTrailers.slice(0,index),
                            {
                                ...state.updatedConfiguration.siteSetUp.belugaTrailers[index],
                                status
                            },
                            ...state.updatedConfiguration.siteSetUp.belugaTrailers.slice(index + 1),
                        ]
                    }
                }
        
             }
        }
        else{
            return {
                ...state,
                updatedConfiguration: {
                    ...state.updatedConfiguration,
                    siteSetUp: {
                        ...state.updatedConfiguration.siteSetUp,
                        factoryTrailers: [
                            ...state.updatedConfiguration.siteSetUp.factoryTrailers.slice(0,index),
                            {
                                ...state.updatedConfiguration.siteSetUp.factoryTrailers[index],
                                status
                            },
                            ...state.updatedConfiguration.siteSetUp.factoryTrailers.slice(index + 1),
                        ]
                    }
                }
        
            }
        }
    }),
    on(updateHangarStatus, (state, {index, status}): FlightSectionPlanningState => ({
        ...state,
        updatedConfiguration: state.updatedConfiguration !== null ?{
            ...state.updatedConfiguration,
            siteSetUp: {
                ...state.updatedConfiguration.siteSetUp,
                hangars: [
                    ...state.updatedConfiguration.siteSetUp.hangars.slice(0,index),
                    {
                        ...state.updatedConfiguration.siteSetUp.hangars[index],
                        status
                    },
                    ...state.updatedConfiguration.siteSetUp.hangars.slice(index + 1),
                ]
            }
        } : null
    })),
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
