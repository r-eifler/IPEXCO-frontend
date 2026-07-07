import { createReducer, on } from "@ngrx/store";
import { PlanPilotFacet } from "../domain/planpilot";
import {
  selectPlanPilotFacet,
  selectPlanPilotFacetFailure,
  selectPlanPilotFacetSuccess,
  startPlanPilotSession,
  startPlanPilotSessionFailure,
  startPlanPilotSessionSuccess,
} from "./planpilot.actions";

export interface PlanPilotState {
  runId: string | undefined;
  facets: PlanPilotFacet[];
  loading: boolean;
  error: unknown;
}

export const initialPlanPilotState: PlanPilotState = {
  runId: undefined,
  facets: [],
  loading: false,
  error: undefined,
};

export const planPilotReducer = createReducer(
  initialPlanPilotState,

  // Trigger: HTTP starts → loading on, clear previous error
  on(startPlanPilotSession, (state) => ({
    ...state,
    loading: true,
    error: undefined,
  })),

  // Success: write the response into the state
  on(startPlanPilotSessionSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    runId: response.runId,
    facets: response.facets,
  })),

  // Failure: loading off, remember the error
  on(startPlanPilotSessionFailure, (state, { err }) => ({
    ...state,
    loading: false,
    error: err,
  })),

  // Select facet: same pattern
  on(selectPlanPilotFacet, (state) => ({
    ...state,
    loading: true,
    error: undefined,
  })),

  on(selectPlanPilotFacetSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    runId: response.runId,
    facets: response.facets,
  })),

  on(selectPlanPilotFacetFailure, (state, { err }) => ({
    ...state,
    loading: false,
    error: err,
  })),
);
