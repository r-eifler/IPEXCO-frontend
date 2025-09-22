import { FlightsHorizon } from "../../flight-section-planning/domain/flight-section";
import { BelugaState, getInitialState } from "../../shared/domain/beluga_state";
import { TestCase, TestSuite } from "./tests";

export function getNumberOfBugs(testCol: TestSuite){
    return testCol?.testCases?.filter(tc => tc.classifiedAdBug).length
}

export function getFullStartStateFromTestCase(section: FlightsHorizon | undefined | null, testCase: TestCase | undefined | null){
    if(section === undefined || section === null || testCase === undefined || testCase === null || testCase.problem == undefined){
        return undefined;
    }
    console.log("TestCase State: ")
    const testState = getInitialState(testCase.problem)
    console.log(testState)
    const startState: BelugaState = {
        ...testState,
        flightIndex: 0, // TODO
        incomingUnloaded: [],
        outgoingLoaded: [],
    }
    return startState
}