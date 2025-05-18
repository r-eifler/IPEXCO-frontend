import { createAction, props } from "@ngrx/store";
import { DomainSpecification } from "src/app/global_specification/domain/domain_specification";
import { PlanProperty, PlanPropertyOfProject } from "src/app/shared/domain/plan-property/plan-property";
import { Project } from "src/app/shared/domain/project";
import { BelugaConfiguration, FlightPlanTree, FlightPlanTreeBase, FlightSection, FlightSectionBase, FlightTargetSchedule, ProductionLineTargetSchedule } from "../domain/flight-section";
import { Service } from "src/app/global_specification/domain/services";
import { BelugaState } from "../../shared/domain/beluga_state";
import { BelugaAction } from "../../shared/domain/beluga_plan";
import { PlanMethod } from "../domain/plan_method";
import { BelugaProblem, Flight, ProductionLine, Side } from "../../shared/domain/beluga_problem";
import { BelugaSiteSetUp, BelugaSiteState, SiteStatus } from "../../shared/domain/site_set_up";


export const loadProject = createAction('[beluga-flight-section-planning] load project', props<{id: string}>());
export const loadProjectSuccess = createAction('[beluga-flight-section-planning] load project success', props<{project: Project}>());
export const loadProjectFailure = createAction('[beluga-flight-section-planning] load project failure', props<{err: any}>());


// domain specifications

export const loadDomainSpecification = createAction('[beluga-flight-section-planning] load domain specification', props<{id: string}>());
export const loadDomainSpecificationSuccess = createAction('[beluga-flight-section-planning] load domain specification success', props<{domainSpecification: DomainSpecification}>());
export const loadDomainSpecificationFailure = createAction('[beluga-flight-section-planning] load domain specification failure', props<{err: any}>());


// plan properties

export const createPlanProperty = createAction('[beluga-flight-section-planning]  create plan property', props<{planProperty: PlanPropertyOfProject}>());
export const createPlanPropertySuccess = createAction('[beluga-flight-section-planning]  create plan property success', props<{planProperty: PlanProperty}>());
export const createPlanPropertyFailure = createAction('[beluga-flight-section-planning]  create plan property failure', props<{ err: any}>());

export const createDefaultPlanProperties = createAction('[beluga-flight-section-planning]  create default plan properties', props<{project: Project}>());


// Flight section tree

export const loadFlightPlanTree= createAction('[beluga-flight-section-planning] load flight plan tree', props<{projectId: string}>());
export const loadFlightPlanTreeSuccess = createAction('[beluga-flight-section-planning] load flight plan tree success', props<{tree: FlightPlanTree| null}>());
export const loadFlightPlanTreeNotNullSuccess = createAction('[beluga-flight-section-planning] load flight plan tree not null success', props<{tree: FlightPlanTree}>());
export const loadFlightPlanTreeFailure = createAction('[beluga-flight-section-planning] load flight plan tree failure', props<{err: any}>());

export const reloadFlightPlanTree= createAction('[beluga-flight-section-planning] reload flight plan tree', props<{id: string}>());
export const reloadFlightPlanTreeSuccess = createAction('[beluga-flight-section-planning] reload flight plan tree success', props<{tree: FlightPlanTree}>());
export const reloadFlightPlanTreeFailure = createAction('[beluga-flight-section-planning] reload flight plan tree failure', props<{err: any}>());

export const initFlightPlanTree = createAction('[beluga-flight-section-planning] init flight plan tree', props<{projectId: string}>());
export const initFlightPlanTreeSuccess = createAction('[beluga-flight-section-planning] init flight plan tree success', props<{tree: FlightPlanTree}>());
export const initFlightPlanTreeFailure = createAction('[beluga-flight-section-planning] init flight plan tree failure', props<{err: any}>());

export const createFlightPlanTree = createAction('[beluga-flight-section-planning] new flight plan tree', props<{tree: FlightPlanTreeBase}>());
export const createFlightPlanTreeSuccess = createAction('[beluga-flight-section-planning] new flight plan tree success', props<{tree: FlightPlanTree}>());
export const createFlightPlanTreeFailure = createAction('[beluga-flight-section-planning] new flight plan tree failure', props<{err: any}>());

export const updateFlightPlanTree = createAction('[beluga-flight-section-planning] update flight plan tree', props<{tree: FlightPlanTree}>());
export const updateFlightPlanTreeSuccess = createAction('[beluga-flight-section-planning] update flight plan tree success', props<{tree: FlightPlanTree}>());
export const updateFlightPlanTreeFailure = createAction('[beluga-flight-section-planning] update flight plan tree failure', props<{err: any}>());

export const updateFlightPlanTreeSelectedSection = createAction('[beluga-flight-section-planning] update flight plan tree selected', props<{id: string}>());

export const selectDifferentBranch = createAction('[beluga-flight-section-planning] select different branch', props<{index: number}>());
export const selectDifferentBranchSuccess = createAction('[beluga-flight-section-planning] select different branch success', props<{tree: FlightPlanTree}>());
export const selectDifferentBranchFailure = createAction('[beluga-flight-section-planning]  select different branch failure', props<{err: any}>());

export const createNewBranch = createAction('[beluga-flight-section-planning] create new branch', props<{sectionId: string, name: string}>());
export const createNewBranchSuccess = createAction('[beluga-flight-section-planning] create new branch success', props<{tree: FlightPlanTree}>());
export const createNewBranchFailure = createAction('[beluga-flight-section-planning] create new branch failure', props<{err: any}>());

// sections
export const loadFlightSections = createAction('[beluga-flight-section-planning] load flight plan sections', props<{treeId: string}>());
export const loadFlightSectionsSuccess = createAction('[beluga-flight-section-planning] load flight plan sections success', props<{sections: Record<string,FlightSection>}>());
export const loadFlightSectionsFailure = createAction('[beluga-flight-section-planning] load flight plan sections failure', props<{err: any}>());

export const createSuccessorFlightSection = createAction('[beluga-flight-section-planning] create successor flight plan section', props<{section: FlightSection}>());

export const createFlightSection = createAction('[beluga-flight-section-planning] new flight plan section', props<{section: FlightSectionBase}>());
export const createFlightSectionSuccess = createAction('[beluga-flight-section-planning] new flight plan section success', props<{section: FlightSection}>());
export const createFlightSectionFailure = createAction('[beluga-flight-section-planning] new flight plan section failure', props<{err: any}>());

export const updateFlightSection = createAction('[beluga-flight-section-planning] update flight plan section', props<{section: FlightSection}>());
export const updateFlightSectionSuccess = createAction('[beluga-flight-section-planning] update flight plan section success', props<{section: FlightSection}>());
export const updateFlightSectionFailure = createAction('[beluga-flight-section-planning] update flight plan section failure', props<{err: any}>());

export const selectSection = createAction('[beluga-flight-section-planning] select section', props<{id: string}>());

// configurations

export const selectConfiguration= createAction('[beluga-flight-section-planning] select configuration', props<{index: number}>());
export const useConfiguration= createAction('[beluga-flight-section-planning] use configuration', props<{index: number}>());

// services
export const loadServices = createAction('[beluga-flight-section-planning] load  services');
export const loadServicesSuccess = createAction('[beluga-flight-section-planning] load  services success', props<{services: Service[]}>());
export const loadServicesFailure = createAction('[beluga-flight-section-planning] load  services failure',  props<{err: any}>());


// planning methods

export const cancelPlanning = createAction('[beluga-flight-section-planning] cancel planning', props<{section: FlightSection}>());
export const cancelPlanningSuccess = createAction('[beluga-flight-section-planning] cancel planning success', props<{section: FlightSection}>());
export const cancelPlanningFailure = createAction('[beluga-flight-section-planning] cancel planning failure', props<{err: any}>());

// manual

export const registerManualPlanning = createAction('[beluga-flight-section-planning] register manual planning', props<{section: FlightSection, method: PlanMethod}>());
export const startManualPlanningSuccess= createAction('[beluga-flight-section-planning] start manual planning success');
export const startManualPlanningFailure = createAction('[beluga-flight-section-planning] start manual planning failure', props<{err: any}>());

// automatic

export const startAutomaticPlanning = createAction('[beluga-flight-section-planning] start automatic planning', props<{section: FlightSection, method: PlanMethod}>());
export const startAutomaticPlanningSuccess = createAction('[beluga-flight-section-planning] start automatic planning success', props<{section: FlightSection}>());
export const startAutomaticPlanningFailure = createAction('[beluga-flight-section-planning] start automatic planning failure', props<{err: any}>());

export const automaticPlanningFinishedSuccess = createAction('[beluga-flight-section-planning] automatic planning finished success', props<{id: string}>());
export const automaticPlanningFinishedFailure = createAction('[beluga-flight-section-planning] automatic planning finished failure', props<{err: any}>());

export const cancelAutomaticPlanning = createAction('[beluga-flight-section-planning] cancel automatic planning', props<{section: FlightSection}>());
export const cancelAutomaticPlanningSuccess = createAction('[beluga-flight-section-planning] cancel planning automatic success');
export const cancelAutomaticPlanningFailure = createAction('[beluga-flight-section-planning] cancel planning automatic failure', props<{err: any}>());


// Configuration updates

export const updateConfigurationOfSectionAndConfigIndex = createAction('[beluga-flight-section-planning] update configuration of section', props<{section: FlightSection, index: number}>());
export const newConfiguration = createAction('[beluga-flight-section-planning] new configuration');

export const skipIncomingJig = createAction('[beluga-flight-section-planning] skip incoming jig', props<{index: number, skip: boolean}>());
export const skipOutgoingJigType = createAction('[beluga-flight-section-planning] skip outgoing jig type', props<{index: number, skip: boolean}>());
export const skipProductionJig = createAction('[beluga-flight-section-planning] skip production jig', props<{productionLineName: string, index: number, skip: boolean}>());
export const updateRackStatus = createAction('[beluga-flight-section-planning] update rack status', props<{index: number, status: SiteStatus}>());
export const updateTrailerStatus = createAction('[beluga-flight-section-planning] update trailer status', props<{index: number, side: Side, status: SiteStatus}>());
export const updateHangarStatus = createAction('[beluga-flight-section-planning] update hangar status', props<{index: number, status: SiteStatus}>());
export const updateMaxSwaps = createAction('[beluga-flight-section-planning] update max swaps', props<{value: number}>());
export const updateEmptyRacks = createAction('[beluga-flight-section-planning] update empty racks', props<{value: number}>());
export const saveConfiguration = createAction('[beluga-flight-section-planning] save configuration');

// explanations

export const startExplanations = createAction('[beluga-flight-section-planning] start explanations', props<{section: FlightSection, configIndex: number}>());
export const startExplanationsSuccess = createAction('[beluga-flight-section-planning] start explanations success', props<{section: FlightSection, configIndex: number}>());
export const startExplanationsFailure = createAction('[beluga-flight-section-planning] start explanations failure', props<{err: any}>());

export const explanationsFinishedSuccess = createAction('[beluga-flight-section-planning] explanations finished success', props<{sectionId: string, configIndex: number}>());
export const explanationsFinishedFailure = createAction('[beluga-flight-section-planning] explanations finished failure', props<{err: any}>());

export const cancelExplanations= createAction('[beluga-flight-section-planning] cancel explanations', props<{section: FlightSection}>());
export const cancelExplanationsSuccess = createAction('[beluga-flight-section-planning] cancel explanations success');
export const cancelExplanationsFailure = createAction('[beluga-flight-section-planning] cancel explanations failure', props<{err: any}>());


// Actions to log user interactions

export const inspectPlan = createAction('[beluga-flight-section-planning] inspect plan', props<{sectionId: string}>());
export const stopInspectPlan = createAction('[beluga-flight-section-planning] stop inspect plan', props<{sectionId: string}>());
export const cancelConfigurationUpdate = createAction('[beluga-flight-section-planning] cancel configuration update');
export const inspectConfig = createAction('[beluga-flight-section-planning] inspect config', props<{sectionId: string, configIndex: number}>());
export const stopInspectConfig = createAction('[beluga-flight-section-planning] stop inspect config', props<{sectionId: string, configIndex: number}>());
