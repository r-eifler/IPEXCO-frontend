import { createAction, props } from "@ngrx/store";
import { DomainSpecification } from "src/app/global_specification/domain/domain_specification";
import { PlanProperty, PlanPropertyOfProject } from "src/app/shared/domain/plan-property/plan-property";
import { Project } from "src/app/shared/domain/project";
import { FlightPlanForest, FlightSection } from "../domain/flight-section";


export const loadProject = createAction('[beluga-flight-section-planning] load project', props<{id: string}>());
export const loadProjectSuccess = createAction('[beluga-flight-section-planning] load project success', props<{project: Project}>());
export const loadProjectFailure = createAction('[beluga-flight-section-planning] load project failure', props<{err: any}>());


// domain specifications

export const loadDomainSpecifications = createAction('[beluga-flight-section-planning] load domain specifications');
export const loadDomainSpecificationsSuccess = createAction('[beluga-flight-section-planning] load domain specifications success', props<{domainSpecifications: DomainSpecification[]}>());
export const loadDomainSpecificationsFailure = createAction('[beluga-flight-section-planning] load domain specifications failure', props<{err: any}>());


// plan properties

export const createPlanProperty = createAction('[beluga-flight-section-planning]  create plan property', props<{planProperty: PlanPropertyOfProject}>());
export const createPlanPropertySuccess = createAction('[beluga-flight-section-planning]  create plan property success', props<{planProperty: PlanProperty}>());
export const createPlanPropertyFailure = createAction('[beluga-flight-section-planning]  create plan property failure', props<{ err: any}>());

export const createDefaultPlanProperties = createAction('[beluga-flight-section-planning]  create default plan properties', props<{project: Project}>());


// Flight section forest

export const loadFlightPlanForest = createAction('[beluga-flight-section-planning] load flight plan forest', props<{id: FlightPlanForest}>());
export const loadFlightPlanForestSuccess = createAction('[beluga-flight-section-planning] load flight plan forest success', props<{project: Project}>());
export const loadFlightPlanForestFailure = createAction('[beluga-flight-section-planning] load flight plan forest failure', props<{err: any}>());



export const newFlightPlanTree = createAction('[beluga-flight-section-planning] new flight plan tree');
export const newFlightPlanTreeSuccess = createAction('[beluga-flight-section-planning] new flight plan tree success');
export const newFlightPlanTreeFailure = createAction('[beluga-flight-section-planning] new flight plan tree failure', props<{err: any}>());


export const addSectionToFlightPlanForest = createAction('[beluga-flight-section-planning] add section to flight plan forest', props<{section: FlightSection, treeIndex: number}>());
export const addSectionToFlightPlanForestSuccess = createAction('[beluga-flight-section-planning] add section to flight plan forest success', props<{section: FlightSection}>());
export const addSectionToFlightPlanForestFailure = createAction('[beluga-flight-section-planning] add section to flight plan forest failure', props<{err: any}>());


export const addRootSectionToFlightPlanForest = createAction('[beluga-flight-section-planning] add root section load flight plan forest', props<{section: FlightSection, treeIndex: number}>());
export const addRootSectionToFlightPlanForestSuccess = createAction('[beluga-flight-section-planning] add root section load flight plan forest', props<{section: FlightSection}>());
export const addRootSectionToFlightPlanForestFailure = createAction('[beluga-flight-section-planning] add root section load flight plan forest', props<{err: any}>());


// interface navigation

export const setFlightStartIndex = createAction('[beluga-flight-section-planning] set flight start index', props<{index: number}>());
export const setFlightEndIndex = createAction('[beluga-flight-section-planning] set flight end index', props<{index: number}>());

export const increaseFlightIndex = createAction('[beluga-flight-section-planning] increase flight index', props<{offset: number}>());
export const decreaseFlightIndex = createAction('[beluga-flight-section-planning] decrease flight index', props<{offset: number}>());