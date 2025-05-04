import { createAction, props } from "@ngrx/store";
import { DomainSpecification } from "src/app/global_specification/domain/domain_specification";
import { PlanProperty, PlanPropertyOfProject } from "src/app/shared/domain/plan-property/plan-property";
import { Project } from "src/app/shared/domain/project";
import { FlightPlanTree, FlightPlanTreeBase, FlightSection, FlightSectionBase } from "../domain/flight-section";
import { Service } from "src/app/global_specification/domain/services";
import { BelugaState } from "../../shared/domain/beluga_state";
import { BelugaAction } from "../../shared/domain/beluga_plan";
import { PlanMethod } from "../domain/plan_method";
import { BelugaProblem } from "../../shared/domain/beluga_problem";


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

export const initFlightPlanTree = createAction('[beluga-flight-section-planning] init flight plan tree', props<{projectId: string, initialState: BelugaState}>());
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

// services
export const loadServices = createAction('[beluga-flight-section-planning] load  services');
export const loadServicesSuccess = createAction('[beluga-flight-section-planning] load  services success', props<{services: Service[]}>());
export const loadServicesFailure = createAction('[beluga-flight-section-planning] load  services failure',  props<{err: any}>());


// planning methods

export const registerManualPlanning = createAction('[beluga-flight-section-planning] register manual planning', props<{section: FlightSection, method: PlanMethod}>());
export const startManualPlanningSuccess= createAction('[beluga-flight-section-planning] start manual planning success');
export const startManualPlanningFailure = createAction('[beluga-flight-section-planning] start manual planning failure', props<{err: any}>());

// planning automatic

export const startAutomaticPlanning = createAction('[beluga-flight-section-planning] start automatic planning', props<{section: FlightSection, method: PlanMethod}>());
export const startAutomaticPlanningSuccess = createAction('[beluga-flight-section-planning] start automatic planning success', props<{section: FlightSection}>());
export const startAutomaticPlanningFailure = createAction('[beluga-flight-section-planning] start automatic planning failure', props<{err: any}>());

export const automaticPlanningFinishedSuccess = createAction('[beluga-flight-section-planning] automatic planning finished success', props<{id: string}>());
export const automaticPlanningFinishedFailure = createAction('[beluga-flight-section-planning] automatic planning finished failure', props<{err: any}>());