import { createFeature } from "@ngrx/store";
import { PolicyTestingReducer } from "./policy-testing.reducer";


export const PolicyTestingFeature = createFeature({
    name: 'PolicyTestingFeature',
    reducer: PolicyTestingReducer
});

export const {
    name,
    reducer,
    selectPolicyTestingFeatureState,
  } = PolicyTestingFeature;