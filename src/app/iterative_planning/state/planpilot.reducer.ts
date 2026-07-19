import { createReducer, on } from "@ngrx/store";
import { PlanPilotFacet, PlanPilotSelectionState, PlanPilotSolution } from "../domain/planpilot";
import {
  queryPlanPilotSolutionCount,
  queryPlanPilotSolutionCountFailure,
  queryPlanPilotSolutionCountSuccess,
  queryPlanPilotSolutionsFailure,
  queryPlanPilotSolutionsSuccess,
  startPlanPilotSession,
  startPlanPilotSessionFailure,
  startPlanPilotSessionSuccess,
  submitPlanPilotSelections,
  submitPlanPilotSelectionsFailure,
  submitPlanPilotSelectionsSuccess,
} from "./planpilot.actions";

export interface PlanPilotState {
  runId: string | undefined;
  facets: PlanPilotFacet[];
  // The decisions the user has committed (selectionState !== neutral).
  // Tracked separately because the backend usually drops a decided facet
  // from the open-facet list once it is committed.
  decisions: PlanPilotFacet[];
  // Number of solutions (plans) still consistent with the committed decisions.
  solutionCount: number | undefined;
  // The remaining plans themselves, enumerated once the set is small enough.
  solutions: PlanPilotSolution[];
  // True while the count/enumeration queries are (re)calculating.
  solutionsLoading: boolean;
  loading: boolean;
  error: unknown;
}

export const initialPlanPilotState: PlanPilotState = {
  runId: undefined,
  facets: [],
  decisions: [],
  solutionCount: undefined,
  solutions: [],
  solutionsLoading: false,
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

  // Success: write the response into the state (fresh session -> no decisions yet)
  on(startPlanPilotSessionSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    runId: response.runId,
    facets: response.facets,
    decisions: [],
    solutionCount: undefined,
    solutions: [],
  })),

  // Failure: loading off, remember the error
  on(startPlanPilotSessionFailure, (state, { err }) => ({
    ...state,
    loading: false,
    error: err,
  })),

  // Submit the staged selections: loading on, plus fold each request into the
  // decisions list. For every request, drop any previous decision for that
  // facet, then re-add it if the new state is a real decision
  // (positive/negative). Neutral = deselect = remove.
  on(submitPlanPilotSelections, (state, { requests }) => {
    let decisions = state.decisions;

    for (const request of requests) {
      const others = decisions.filter((d) => d.id !== request.facetId);
      if (request.selectionState !== PlanPilotSelectionState.NEUTRAL) {
        const facet =
          state.facets.find((f) => f.id === request.facetId) ??
          decisions.find((d) => d.id === request.facetId);
        decisions = facet
          ? [...others, { ...facet, selectionState: request.selectionState }]
          : others;
      } else {
        decisions = others;
      }
    }

    return { ...state, loading: true, error: undefined, decisions };
  }),

  on(submitPlanPilotSelectionsSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    runId: response.runId,
    facets: response.facets,
  })),

  on(submitPlanPilotSelectionsFailure, (state, { err }) => ({
    ...state,
    loading: false,
    error: err,
  })),

  // Recalculation starts: the count/enumeration chain is triggered.
  on(queryPlanPilotSolutionCount, (state) => ({
    ...state,
    solutionsLoading: true,
  })),

  // Counter refresh: store the number of remaining solutions.
  on(queryPlanPilotSolutionCountSuccess, (state, { count }) => ({
    ...state,
    solutionCount: count,
  })),

  // Store the enumerated remaining plans (empty when the set is too large).
  // This is the end of the chain, so the recalculation is done.
  on(queryPlanPilotSolutionsSuccess, (state, { solutions }) => ({
    ...state,
    solutions,
    solutionsLoading: false,
  })),

  // Any query failure also ends the recalculation.
  on(queryPlanPilotSolutionCountFailure, queryPlanPilotSolutionsFailure, (state) => ({
    ...state,
    solutionsLoading: false,
  })),
);
