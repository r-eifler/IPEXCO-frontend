import { createAction, props } from "@ngrx/store";
import {
  PlanPilotFacetsResponse,
  PlanPilotSolution,
  SelectPlanPilotFacetRequest,
  StartPlanPilotSessionRequest,
  StartPlanPilotSessionResponse,
} from "../domain/planpilot";

// Start session
export const startPlanPilotSession = createAction(
  "[planpilot] start session",
  props<{ request: StartPlanPilotSessionRequest }>(),
);
export const startPlanPilotSessionSuccess = createAction(
  "[planpilot] start session success",
  props<{ response: StartPlanPilotSessionResponse }>(),
);
export const startPlanPilotSessionFailure = createAction(
  "[planpilot] start session failure",
  props<{ err: unknown }>(),
);

// Submit the staged selections (positive / negative / neutral) as one batch.
export const submitPlanPilotSelections = createAction(
  "[planpilot] submit selections",
  props<{ requests: SelectPlanPilotFacetRequest[] }>(),
);
export const submitPlanPilotSelectionsSuccess = createAction(
  "[planpilot] submit selections success",
  props<{ response: PlanPilotFacetsResponse }>(),
);
export const submitPlanPilotSelectionsFailure = createAction(
  "[planpilot] submit selections failure",
  props<{ err: unknown }>(),
);

// Query how many solutions (plans) are still consistent with the decisions.
export const queryPlanPilotSolutionCount = createAction(
  "[planpilot] query solution count",
);
export const queryPlanPilotSolutionCountSuccess = createAction(
  "[planpilot] query solution count success",
  props<{ count: number | undefined }>(),
);
export const queryPlanPilotSolutionCountFailure = createAction(
  "[planpilot] query solution count failure",
  props<{ err: unknown }>(),
);

// Enumerate the solutions (plans) still consistent with the decisions.
export const queryPlanPilotSolutions = createAction(
  "[planpilot] query solutions",
);
export const queryPlanPilotSolutionsSuccess = createAction(
  "[planpilot] query solutions success",
  props<{ solutions: PlanPilotSolution[] }>(),
);
export const queryPlanPilotSolutionsFailure = createAction(
  "[planpilot] query solutions failure",
  props<{ err: unknown }>(),
);
