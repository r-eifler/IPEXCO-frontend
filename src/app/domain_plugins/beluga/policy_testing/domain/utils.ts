import { TestCollection } from "./test-case";

export function getNumberOfBugs(testCol: TestCollection){
    return testCol?.testCases?.filter(tc => tc.classifiedAdBug).length
}