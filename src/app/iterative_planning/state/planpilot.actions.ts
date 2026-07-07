import { createAction, props } from "@ngrx/store";
import {
  PlanPilotFacetsResponse,
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

// Select facet (positive / negative / neutral)
export const selectPlanPilotFacet = createAction(
  "[planpilot] select facet",
  props<{ request: SelectPlanPilotFacetRequest }>(),
);
export const selectPlanPilotFacetSuccess = createAction(
  "[planpilot] select facet success",
  props<{ response: PlanPilotFacetsResponse }>(),
);
export const selectPlanPilotFacetFailure = createAction(
  "[planpilot] select facet failure",
  props<{ err: unknown }>(),
);
