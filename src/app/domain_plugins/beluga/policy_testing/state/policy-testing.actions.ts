import { createAction, props } from "@ngrx/store";
import { Project } from "src/app/shared/domain/project";
import { TestCollection, TestCollectionBase } from "../domain/test-case";

// project

export const loadProject = createAction('[policy-testing] load project', props<{id: string}>());
export const loadProjectSuccess = createAction('[policy-testing] load project success', props<{project: Project}>());
export const loadProjectFailure = createAction('[policy-testing] load project failure', props<{err: any}>());


// tests

export const loadTestCollections = createAction('[policy-testing] load test collections', props<{projectId: string}>());
export const loadTestCollectionsSuccess = createAction('[policy-testing] load test collections success', props<{testCollections: TestCollection[]}>());
export const loadTestCollectionsFailure = createAction('[policy-testing] load test collections failure', props<{err: any}>());

export const createTestCollections = createAction('[policy-testing] create test collections', props<{testCollection: TestCollectionBase}>());
export const createTestCollectionsSuccess = createAction('[policy-testing] create test collections success', props<{testCollection: TestCollectionBase}>());
export const createTestCollectionsFailure = createAction('[policy-testing] create test collections failure', props<{err: any}>());

export const selectTestSuite = createAction('[policy-testing] select test suite', props<{testSuiteId: string}>());