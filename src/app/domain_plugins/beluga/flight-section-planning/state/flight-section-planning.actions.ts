import { createAction, props } from "@ngrx/store";
import { DomainSpecification } from "src/app/global_specification/domain/domain_specification";
import { Service } from "src/app/global_specification/domain/services";
import { PlanProperty, PlanPropertyOfProject } from "src/app/shared/domain/plan-property/plan-property";
import { Project } from "src/app/shared/domain/project";
import { Flight, Side } from "../../shared/domain/beluga_problem";
import { SiteStatus } from "../../shared/domain/site_set_up";
import { PlanMethod } from "../domain/plan_method";
import { FlightPlanTree, FlightPlanTreeBase, FlightsHorizon, FlightsHorizonBase } from "../domain/flight-section";


export const loadProject = createAction('[beluga-flights-horizon-planning] load project', props<{id: string}>());
export const loadProjectSuccess = createAction('[beluga-flights-horizon-planning] load project success', props<{project: Project}>());
export const loadProjectFailure = createAction('[beluga-flights-horizon-planning] load project failure', props<{err: any}>());


// domain specifications

export const loadDomainSpecification = createAction('[beluga-flights-horizon-planning] load domain specification', props<{id: string}>());
export const loadDomainSpecificationSuccess = createAction('[beluga-flights-horizon-planning] load domain specification success', props<{domainSpecification: DomainSpecification}>());
export const loadDomainSpecificationFailure = createAction('[beluga-flights-horizon-planning] load domain specification failure', props<{err: any}>());


// plan properties

export const createPlanProperty = createAction('[beluga-flights-horizon-planning]  create plan property', props<{planProperty: PlanPropertyOfProject}>());
export const createPlanPropertySuccess = createAction('[beluga-flights-horizon-planning]  create plan property success', props<{planProperty: PlanProperty}>());
export const createPlanPropertyFailure = createAction('[beluga-flights-horizon-planning]  create plan property failure', props<{ err: any}>());

export const createDefaultPlanProperties = createAction('[beluga-flights-horizon-planning]  create default plan properties', props<{project: Project}>());


// Flight section tree

export const loadFlightPlanTree= createAction('[beluga-flights-horizon-planning] load flight plan tree', props<{projectId: string}>());
export const loadFlightPlanTreeSuccess = createAction('[beluga-flights-horizon-planning] load flight plan tree success', props<{tree: FlightPlanTree| null}>());
export const loadFlightPlanTreeNotNullSuccess = createAction('[beluga-flights-horizon-planning] load flight plan tree not null success', props<{tree: FlightPlanTree}>());
export const loadFlightPlanTreeFailure = createAction('[beluga-flights-horizon-planning] load flight plan tree failure', props<{err: any}>());

export const reloadFlightPlanTree= createAction('[beluga-flights-horizon-planning] reload flight plan tree', props<{id: string}>());
export const reloadFlightPlanTreeSuccess = createAction('[beluga-flights-horizon-planning] reload flight plan tree success', props<{tree: FlightPlanTree}>());
export const reloadFlightPlanTreeFailure = createAction('[beluga-flights-horizon-planning] reload flight plan tree failure', props<{err: any}>());

export const initFlightPlanTree = createAction('[beluga-flights-horizon-planning] init flight plan tree', props<{projectId: string}>());
export const initFlightPlanTreeSuccess = createAction('[beluga-flights-horizon-planning] init flight plan tree success', props<{tree: FlightPlanTree}>());
export const initFlightPlanTreeFailure = createAction('[beluga-flights-horizon-planning] init flight plan tree failure', props<{err: any}>());

export const createFlightPlanTree = createAction('[beluga-flights-horizon-planning] new flight plan tree', props<{tree: FlightPlanTreeBase}>());
export const createFlightPlanTreeSuccess = createAction('[beluga-flights-horizon-planning] new flight plan tree success', props<{tree: FlightPlanTree}>());
export const createFlightPlanTreeFailure = createAction('[beluga-flights-horizon-planning] new flight plan tree failure', props<{err: any}>());

export const updateFlightPlanTree = createAction('[beluga-flights-horizon-planning] update flight plan tree', props<{tree: FlightPlanTree}>());
export const updateFlightPlanTreeSuccess = createAction('[beluga-flights-horizon-planning] update flight plan tree success', props<{tree: FlightPlanTree}>());
export const updateFlightPlanTreeFailure = createAction('[beluga-flights-horizon-planning] update flight plan tree failure', props<{err: any}>());

export const updateFlightPlanTreeSelectedSection = createAction('[beluga-flights-horizon-planning] update flight plan tree selected', props<{id: string}>());

export const selectDifferentBranch = createAction('[beluga-flights-horizon-planning] select different branch', props<{index: number}>());
export const selectDifferentBranchSuccess = createAction('[beluga-flights-horizon-planning] select different branch success', props<{tree: FlightPlanTree}>());
export const selectDifferentBranchFailure = createAction('[beluga-flights-horizon-planning]  select different branch failure', props<{err: any}>());

export const createNewBranch = createAction('[beluga-flights-horizon-planning] create new branch', props<{section: FlightsHorizon, name: string, prefix: number[], horizon: number[]}>());
export const createNewBranchSuccess = createAction('[beluga-flights-horizon-planning] create new branch success', props<{tree: FlightPlanTree}>());
export const createNewBranchFailure = createAction('[beluga-flights-horizon-planning] create new branch failure', props<{err: any}>());

// sections
export const loadFlightsHorizons = createAction('[beluga-flights-horizon-planning] load flights horizons', props<{treeId: string}>());
export const loadFlightsHorizonsSuccess = createAction('[beluga-flights-horizon-planning] load flights horizons success', props<{sections: Record<string,FlightsHorizon>}>());
export const loadFlightsHorizonsFailure = createAction('[beluga-flights-horizon-planning] load flights horizons failure', props<{err: any}>());

export const createSuccessorFlightsHorizon = createAction('[beluga-flights-horizon-planning] create successor flights horizon', props<{section: FlightsHorizon, flights: Flight[], horizon: number[]}>());

export const createFlightsHorizon = createAction('[beluga-flights-horizon-planning] new flights horizon', props<{section: FlightsHorizonBase}>());
export const createFlightsHorizonSuccess = createAction('[beluga-flights-horizon-planning] new flights horizon success', props<{section: FlightsHorizon}>());
export const createFlightsHorizonFailure = createAction('[beluga-flights-horizon-planning] new flights horizon failure', props<{err: any}>());

export const updateFlightsHorizon = createAction('[beluga-flights-horizon-planning] update flights horizon', props<{section: FlightsHorizon}>());
export const updateFlightsHorizonSuccess = createAction('[beluga-flights-horizon-planning] update flights horizon success', props<{section: FlightsHorizon}>());
export const updateFlightsHorizonFailure = createAction('[beluga-flights-horizon-planning] update flights horizon failure', props<{err: any}>());

export const selectSection = createAction('[beluga-flights-horizon-planning] select section', props<{id: string}>());

// configurations

export const selectConfiguration= createAction('[beluga-flights-horizon-planning] select configuration', props<{index: number}>());
export const useConfiguration= createAction('[beluga-flights-horizon-planning] use configuration', props<{index: number}>());

// services
export const loadServices = createAction('[beluga-flights-horizon-planning] load  services');
export const loadServicesSuccess = createAction('[beluga-flights-horizon-planning] load  services success', props<{services: Service[]}>());
export const loadServicesFailure = createAction('[beluga-flights-horizon-planning] load  services failure',  props<{err: any}>());


// planning methods

export const cancelPlanning = createAction('[beluga-flights-horizon-planning] cancel planning', props<{section: FlightsHorizon}>());
export const cancelPlanningSuccess = createAction('[beluga-flights-horizon-planning] cancel planning success', props<{section: FlightsHorizon}>());
export const cancelPlanningFailure = createAction('[beluga-flights-horizon-planning] cancel planning failure', props<{err: any}>());

// manual

export const registerManualPlanning = createAction('[beluga-flights-horizon-planning] register manual planning', props<{section: FlightsHorizon, method: PlanMethod}>());
export const startManualPlanningSuccess= createAction('[beluga-flights-horizon-planning] start manual planning success');
export const startManualPlanningFailure = createAction('[beluga-flights-horizon-planning] start manual planning failure', props<{err: any}>());

// automatic

export const startAutomaticPlanning = createAction('[beluga-flights-horizon-planning] start automatic planning', props<{section: FlightsHorizon, method: PlanMethod}>());
export const startAutomaticPlanningSuccess = createAction('[beluga-flights-horizon-planning] start automatic planning success', props<{section: FlightsHorizon}>());
export const startAutomaticPlanningFailure = createAction('[beluga-flights-horizon-planning] start automatic planning failure', props<{err: any}>());

export const automaticPlanningFinishedSuccess = createAction('[beluga-flights-horizon-planning] automatic planning finished success', props<{id: string}>());
export const automaticPlanningFinishedFailure = createAction('[beluga-flights-horizon-planning] automatic planning finished failure', props<{err: any}>());

export const cancelAutomaticPlanning = createAction('[beluga-flights-horizon-planning] cancel automatic planning', props<{section: FlightsHorizon}>());
export const cancelAutomaticPlanningSuccess = createAction('[beluga-flights-horizon-planning] cancel planning automatic success');
export const cancelAutomaticPlanningFailure = createAction('[beluga-flights-horizon-planning] cancel planning automatic failure', props<{err: any}>());


// Configuration updates

export const updateConfigurationOfSectionAndConfigIndex = createAction('[beluga-flights-horizon-planning] update configuration of section', props<{section: FlightsHorizon, index: number}>());
export const newConfiguration = createAction('[beluga-flights-horizon-planning] new configuration');

export const skipIncomingJig = createAction('[beluga-flights-horizon-planning] skip incoming jig', props<{flightIndex: number, index: number, skip: boolean}>());
export const skipOutgoingJigType = createAction('[beluga-flights-horizon-planning] skip outgoing jig type', props<{flightIndex: number, index: number, skip: boolean}>());
export const skipProductionJig = createAction('[beluga-flights-horizon-planning] skip production jig', props<{productionLineName: string, index: number, skip: boolean}>());
export const updateRackStatus = createAction('[beluga-flights-horizon-planning] update rack status', props<{index: number, status: SiteStatus}>());
export const updateTrailerStatus = createAction('[beluga-flights-horizon-planning] update trailer status', props<{index: number, side: Side, status: SiteStatus}>());
export const updateHangarStatus = createAction('[beluga-flights-horizon-planning] update hangar status', props<{index: number, status: SiteStatus}>());
export const updateMaxSwaps = createAction('[beluga-flights-horizon-planning] update max swaps', props<{value: number}>());
export const updateEmptyRacks = createAction('[beluga-flights-horizon-planning] update empty racks', props<{value: number}>());
export const saveConfiguration = createAction('[beluga-flights-horizon-planning] save configuration');

// explanations

export const startExplanations = createAction('[beluga-flights-horizon-planning] start explanations', props<{section: FlightsHorizon, configIndex: number}>());
export const startExplanationsSuccess = createAction('[beluga-flights-horizon-planning] start explanations success', props<{section: FlightsHorizon, configIndex: number}>());
export const startExplanationsFailure = createAction('[beluga-flights-horizon-planning] start explanations failure', props<{err: any}>());

export const explanationsFinishedSuccess = createAction('[beluga-flights-horizon-planning] explanations finished success', props<{sectionId: string, configIndex: number}>());
export const explanationsFinishedFailure = createAction('[beluga-flights-horizon-planning] explanations finished failure', props<{err: any}>());

export const cancelExplanations= createAction('[beluga-flights-horizon-planning] cancel explanations', props<{section: FlightsHorizon}>());
export const cancelExplanationsSuccess = createAction('[beluga-flights-horizon-planning] cancel explanations success');
export const cancelExplanationsFailure = createAction('[beluga-flights-horizon-planning] cancel explanations failure', props<{err: any}>());


// Actions to log user interactions

export const inspectPlan = createAction('[beluga-flights-horizon-planning] inspect plan', props<{sectionId: string}>());
export const stopInspectPlan = createAction('[beluga-flights-horizon-planning] stop inspect plan', props<{sectionId: string}>());
export const cancelConfigurationUpdate = createAction('[beluga-flights-horizon-planning] cancel configuration update');
export const inspectConfig = createAction('[beluga-flights-horizon-planning] inspect config', props<{sectionId: string, configIndex: number}>());
export const stopInspectConfig = createAction('[beluga-flights-horizon-planning] stop inspect config', props<{sectionId: string, configIndex: number}>());
