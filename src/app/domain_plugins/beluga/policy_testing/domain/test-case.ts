import { array, boolean, nativeEnum, number, object, string, unknown, infer as zinfer } from "zod";
import { BelugaActionZ } from "../../shared/domain/beluga_plan";
import { BelugaStateZ } from "../../shared/domain/beluga_state";


export const PolicyZ = object({
   name: string(),
   model: unknown()
})

export type Policy = zinfer<typeof PolicyZ>;



export enum TestRunStatus {
    PENDING = "PENDING",
    RUNNING = "RUNNING",
    FAILED = "FAILED",
    FINISHED = "FINISHED"
}

export const TestRunStatusZ = nativeEnum(TestRunStatus);

export const TestCaseZ = object({
    stateID: number(),
    testID: number(),
    state: BelugaStateZ,
    policyTrace: array(BelugaActionZ),
    policyCost: number(),
    classifiedAdBug: boolean(),
    status: TestRunStatusZ,
})

export type TestCase = zinfer<typeof TestCaseZ>;



export const TestCollectionZ = object({
   name: string(),
   policy: PolicyZ,
   numFuzzStates: number(),
   testCases: array(TestCaseZ)
})

export type TestCollection = zinfer<typeof TestCollectionZ>;