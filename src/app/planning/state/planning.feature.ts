import { createFeature } from "@ngrx/store";
import { planningReducer } from "./planning.reducer";


export const planningFeature = createFeature({
    name: 'planningFeature',
    reducer: planningReducer
});

export const {
    name,
    reducer,
    selectPlanningFeatureState,
    selectDomainSpecification,
    selectServices,
    selectProject,
    selectPlanId,
    selectPlans
  } = planningFeature;