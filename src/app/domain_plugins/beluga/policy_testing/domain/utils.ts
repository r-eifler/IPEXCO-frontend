import { TestSuite } from "./tests";

export function getNumberOfBugs(testCol: TestSuite){
    return testCol?.testCases?.filter(tc => tc.classifiedAdBug).length
}