import { createReducer, on } from "@ngrx/store";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { Project } from "src/app/shared/domain/project";
import { loadProject, loadProjectSuccess, loadTestCollections, loadTestCollectionsSuccess, selectTestSuite } from "./policy-testing.actions";
import { TestCollection } from "../domain/test-case";

export interface PolicyTestingState {
    project: Loadable<Project>,
    testCollections: Loadable<TestCollection[]>,
    selectedTestSuiteId: null | string
}

const initialState: PolicyTestingState = {
    project: {state: LoadingState.Initial, data: undefined},
    testCollections: {state: LoadingState.Initial, data: undefined},
    selectedTestSuiteId: null
}

export const PolicyTestingReducer = createReducer(
    initialState,
    on(loadProject, (state): PolicyTestingState => ({
        ...state,
        project: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadProjectSuccess, (state, {project}): PolicyTestingState => ({
        ...state,
        project: {state: LoadingState.Done, data: project},
    })),
    on(loadTestCollections, (state): PolicyTestingState => ({
        ...state,
        testCollections: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadTestCollectionsSuccess, (state, {testCollections}): PolicyTestingState => ({
        ...state,
        testCollections: {state: LoadingState.Done, data: testCollections},
    })),
    on(selectTestSuite, (state, {testSuiteId}): PolicyTestingState => ({
        ...state,
        selectedTestSuiteId: testSuiteId,
    })),
);