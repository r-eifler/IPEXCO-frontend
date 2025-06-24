import { createSelector } from "@ngrx/store";
import { PolicyTestingFeature } from "./policy-testing.feature";


const selectState = PolicyTestingFeature.selectPolicyTestingFeatureState

// Project/Task

export const selectProject = createSelector(selectState, 
    (state) => state.project.data
);

