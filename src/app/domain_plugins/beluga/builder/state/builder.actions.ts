import { createAction, props } from "@ngrx/store";
import { Project } from "src/app/shared/domain/project";
import { BelugaProblem, Side } from "../../shared/domain/beluga_problem";
import { BelugaAction } from "../../shared/domain/beluga_plan";
import { DragSource } from "./builder.reducer";
import { BelugaState } from "../../shared/domain/beluga_state";
import { BelugaConfiguration, FlightsHorizon, FlightsHorizonBase } from "../../flight-section-planning/domain/flight-section";

// project

export const loadProject = createAction('[beluga-builder] load project', props<{id: string}>());
export const loadProjectSuccess = createAction('[beluga-builder] load project success', props<{project: Project}>());
export const loadProjectFailure = createAction('[beluga-builder] load project failure', props<{err: any}>());

// sections
export const loadFlightsHorizon = createAction('[beluga-builder] load flight plan section', props<{id: string}>());
export const loadFlightsHorizonSuccess = createAction('[beluga-builder] load flight plan section success', props<{section: FlightsHorizon}>());
export const loadFlightsHorizonFailure = createAction('[beluga-builder] load flight plan section failure', props<{err: any}>());

export const createSuccessorFlightsHorizon = createAction('[beluga-builder] create successor flight plan section', props<{section: FlightsHorizon}>());

export const createFlightsHorizon = createAction('[beluga-builder] new flight plan section', props<{section: FlightsHorizonBase}>());
export const createFlightsHorizonSuccess = createAction('[beluga-builder] new flight plan section success', props<{section: FlightsHorizon}>());
export const createFlightsHorizonFailure = createAction('[beluga-builder] new flight plan section failure', props<{err: any}>());

export const updateFlightsHorizon = createAction('[beluga-builder] update flight plan section', props<{section: FlightsHorizon}>());
export const updateFlightsHorizonSuccess = createAction('[beluga-builder] update flight plan section success', props<{section: FlightsHorizon}>());
export const updateFlightsHorizonFailure = createAction('[beluga-builder] update flight plan section failure', props<{err: any}>());

// builder

export const initBuilder = createAction('[beluga-builder] init task', props<{task: BelugaProblem, initState: BelugaState}>());

export const finishManualPlanning = createAction('[beluga-builder] finish manual planning', props<{actions: BelugaAction[], solved: boolean}>());
export const finishManualPlanningFailure = createAction('[beluga-builder] finish manual planning failure', props<{err: any}>());

export const cancelManualPlanning = createAction('[beluga-builder] cancel manual planning', props<{sectionId: string, planAttempt: BelugaAction[], config: BelugaConfiguration}>());
export const cancelManualPlanningFailure = createAction('[beluga-builder] cancel manual planning failure', props<{err: any}>());


// Flight Schedule updates

export const skipIncomingJig = createAction('[beluga-builder] skip incoming jig', props<{jigName: string, flightIndex: number}>());
export const skipOutgoingJigType = createAction('[beluga-builder] skip outgoing jig type', props<{jigType: string, flightIndex: number, index: number}>());
export const skipProductionJig = createAction('[beluga-builder] skip production jig', props<{jigName: string, productionLineName: string}>());

// Beluga actions

export const createNewBelugaAction = createAction('[beluga-builder] new Beluga action', props<{action: BelugaAction}>());

export const nextFlight = createAction('[beluga-builder] nextFlight');


// drag & drop

export const startDrag = createAction('[beluga-builder] start drag', props<{source: DragSource, jigName: string, sides: Side[]}>());
export const stopDrag = createAction('[beluga-builder] stop drag', props<{target: DragSource}>());
export const cancelDrag = createAction('[beluga-builder] cancel drag');