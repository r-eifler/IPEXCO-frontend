import { FlightSection, getFullStartState } from "../../flight-section-planning/domain/flight-section";
import { BelugaState, getInitialState } from "../../shared/domain/beluga_state";
import { TestCase, TestSuite } from "./tests";

export function getNumberOfBugs(testCol: TestSuite){
    return testCol?.testCases?.filter(tc => tc.classifiedAdBug).length
}

export function getFullStartStateFromTestCase(section: FlightSection | undefined | null, testCase: TestCase | undefined | null){
    if(section === undefined || section === null || testCase === undefined || testCase === null || testCase.state == undefined){
        return undefined;
    }
    console.log("TestCase State: ")
    const testState = getInitialState(testCase.state)
    console.log(testState)
    const startState: BelugaState = {
        ...testState,
        flightIndex: section.flightIndex,
        incomingUnloaded: [],
        outgoingLoaded: [],
    }
    return startState
}