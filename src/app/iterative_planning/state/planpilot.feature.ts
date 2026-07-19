import { createFeature } from "@ngrx/store";
import { planPilotReducer } from "./planpilot.reducer";

export const planPilotFeature = createFeature({
  name: "planPilotFeature",
  reducer: planPilotReducer,
});

export const {
  name,
  reducer,
  selectRunId,
  selectFacets,
  selectDecisions,
  selectSolutionCount,
  selectSolutions,
  selectSolutionsLoading,
  selectLoading,
  selectError,
} = planPilotFeature;
