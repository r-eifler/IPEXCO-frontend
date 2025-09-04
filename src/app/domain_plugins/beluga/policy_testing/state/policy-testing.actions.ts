import { createAction, props } from "@ngrx/store";
import { Project } from "src/app/shared/domain/project";
import { TestSuite, TestSuiteBase } from "../domain/tests";
import { FlightPlanTree, FlightSection } from "../../flight-section-planning/domain/flight-section";

// project

export const loadProject = createAction('[policy-testing] load project', props<{id: string}>());
export const loadProjectSuccess = createAction('[policy-testing] load project success', props<{project: Project}>());
export const loadProjectFailure = createAction('[policy-testing] load project failure', props<{err: any}>());


// flight plan tree

export const loadFlightPlanTree= createAction('[policy-testing]load flight plan tree', props<{projectId: string}>());
export const loadFlightPlanTreeSuccess = createAction('[policy-testing]load flight plan tree success', props<{tree: FlightPlanTree}>());
export const loadFlightPlanTreeFailure = createAction('[policy-testing]load flight plan tree failure', props<{err: any}>());

export const loadFlightSections = createAction('[policy-testing]load flight plan sections', props<{treeId: string}>());
export const loadFlightSectionsSuccess = createAction('[policy-testing]load flight plan sections success', props<{sections: Record<string,FlightSection>}>());
export const loadFlightSectionsFailure = createAction('[policy-testing]load flight plan sections failure', props<{err: any}>());


// tests

export const loadTestCollections = createAction('[policy-testing] load test collections', props<{projectId: string}>());
export const loadTestCollectionsSuccess = createAction('[policy-testing] load test collections success', props<{testCollections: TestSuite[]}>());
export const loadTestCollectionsFailure = createAction('[policy-testing] load test collections failure', props<{err: any}>());

export const createTestCollections = createAction('[policy-testing] create test collections', props<{testCollection: TestSuiteBase}>());
export const createTestCollectionsSuccess = createAction('[policy-testing] create test collections success', props<{testCollection: TestSuiteBase}>());
export const createTestCollectionsFailure = createAction('[policy-testing] create test collections failure', props<{err: any}>());

export const resetTestCollection = createAction('[policy-testing] reset test collection', props<{suiteId: string}>());
export const resetTestCollectionSuccess = createAction('[policy-testing] reset test collection success', props<{testCollection: TestSuite}>());
export const resetTestCollectionFailure = createAction('[policy-testing] reset test collection failure', props<{err: any}>());

export const selectTestSuite = createAction('[policy-testing] select test suite', props<{testSuiteId: string}>());
export const selectTestCase = createAction('[policy-testing] select test case', props<{testCaseIndex: number}>());


export const startTestStateFuzzing = createAction('[policy-testing] start test state fuzzing', props<{testSuiteId: string, numberOfFuzzedStates: number}>());
export const startTestStateFuzzingSuccess = createAction('[policy-testing] start test state fuzzing success', props<{testCollection: TestSuite}>());
export const startTestStateFuzzingFailure = createAction('[policy-testing] start test state fuzzing failure', props<{err: any}>());

export const finishedTestStateFuzzingSuccess = createAction('[policy-testing] finished test state fuzzing success', props<{id: string}>());
export const finishedTestStateFuzzingFailure = createAction('[policy-testing] finished test state fuzzing failure', props<{err: any}>());