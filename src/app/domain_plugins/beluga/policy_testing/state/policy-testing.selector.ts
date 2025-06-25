import { createSelector } from "@ngrx/store";
import { PolicyTestingFeature } from "./policy-testing.feature";


const selectState = PolicyTestingFeature.selectPolicyTestingFeatureState

// Project/Task

export const selectProject = createSelector(selectState, 
    (state) => state.project.data
);


export const selectTestCollections= createSelector(selectState, 
    (state) => state.testCollections.data
);

export const selectSelectedTestSuiteId= createSelector(selectState, 
    (state) => state.selectedTestSuiteId
);


export const selectSelectedTestSuite = createSelector(selectSelectedTestSuiteId, selectTestCollections, 
    (id, testCollections) => id !== null && testCollections !== undefined ? testCollections.find(e => e._id === id) : undefined
);