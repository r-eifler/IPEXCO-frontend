import { createFeature } from "@ngrx/store";
import { FlightSectionPlanningReducer } from "./flight-section-planning.reducer";


export const FlightSectionPlanningFeature = createFeature({
    name: 'FlightSectionPlanning',
    reducer: FlightSectionPlanningReducer
});

export const {
    name,
    reducer,
    selectUpdatedConfiguration
  } = FlightSectionPlanningFeature;