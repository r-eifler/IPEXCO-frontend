import { FlightsHorizon } from "../../flight-section-planning/domain/flight-section";
import { BelugaState, getInitialState } from "../../shared/domain/beluga_state";
import { TestCase, TestSuite } from "./tests";

export function getNumberOfBugs(testCol: TestSuite){
    return testCol?.testCases?.filter(tc => tc.classifiedAdBug).length
}
