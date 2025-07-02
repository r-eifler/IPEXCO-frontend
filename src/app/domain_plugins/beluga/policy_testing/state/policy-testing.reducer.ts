import { createReducer, on } from "@ngrx/store";
import { Loadable, LoadingState } from "src/app/shared/common/loadable.interface";
import { Project } from "src/app/shared/domain/project";
import { loadProject, loadProjectSuccess, loadTestCollections, loadTestCollectionsSuccess, selectTestSuite, loadFlightSections, loadFlightSectionsSuccess, loadFlightPlanTreeSuccess, selectTestCase } from "./policy-testing.actions";
import { TestSuite } from "../domain/tests";
import { FlightPlanTree, FlightSection } from "../../flight-section-planning/domain/flight-section";
import { updateFlightPlanTreeSuccess } from "../../flight-section-planning/state/flight-section-planning.actions";

export interface PolicyTestingState {
    project: Loadable<Project>,
    testCollections: Loadable<TestSuite[]>,
    selectedTestSuiteId: null | string,
    selectedTestCaseIndex: null | number,
    tree: Loadable<FlightPlanTree | null>;
    sections: Loadable<Record<string,FlightSection>>;
}

const initialState: PolicyTestingState = {
    project: {state: LoadingState.Initial, data: undefined},
    testCollections: {state: LoadingState.Initial, data: undefined},
    selectedTestSuiteId: null,
    selectedTestCaseIndex: null,
    tree: {state: LoadingState.Initial, data: undefined},
    sections: {state: LoadingState.Initial, data: undefined},
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
    // on(loadTestCollections, (state): PolicyTestingState => ({
    //     ...state,
    //     testCollections: {state: LoadingState.Loading, data: undefined},
    // })),
    on(loadTestCollectionsSuccess, (state, {testCollections}): PolicyTestingState => ({
        ...state,
        testCollections: {state: LoadingState.Done, data: testCollections},
    })),
    on(selectTestSuite, (state, {testSuiteId}): PolicyTestingState => ({
        ...state,
        selectedTestSuiteId: testSuiteId,
    })),
     on(selectTestCase, (state, {testCaseIndex}): PolicyTestingState => ({
        ...state,
        selectedTestCaseIndex: testCaseIndex,
    })),
    on(loadFlightPlanTreeSuccess, (state, {tree}): PolicyTestingState => ({
        ...state,
        tree: {state: LoadingState.Done, data: tree},
    })),
    on(updateFlightPlanTreeSuccess, (state, {tree}): PolicyTestingState => ({
        ...state,
        tree: state.project.data !== undefined && state.project.data._id == tree.project ? 
            {state: LoadingState.Done, data: tree} : state.tree,
    })),
    on(loadFlightSections, (state): PolicyTestingState => ({
        ...state,
        sections: {state: LoadingState.Loading, data: undefined},
    })),
    on(loadFlightSectionsSuccess, (state, {sections}): PolicyTestingState => ({
        ...state,
        sections: {state: LoadingState.Done, data: sections}
    })),
);