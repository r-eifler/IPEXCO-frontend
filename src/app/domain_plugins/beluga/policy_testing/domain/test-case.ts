import { array, boolean, nativeEnum, number, object, string, unknown, infer as zinfer } from "zod";
import { BelugaActionZ } from "../../shared/domain/beluga_plan";
import { BelugaStateZ } from "../../shared/domain/beluga_state";


export const FileUploadZ = object({
   filename: string(),
   originalname: string()
})

export type FileUpload = zinfer<typeof FileUploadZ>;


export const PolicyZ = object({
   name: string(),
   modelFileName: string()
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



export const TestCollectionBaseZ = object({
   name: string(),
   project: string(),
   policy: PolicyZ,
   numFuzzStates: number(),
   testCases: array(TestCaseZ)
})

export type TestCollectionBase = zinfer<typeof TestCollectionBaseZ>;

export const TestCollectionZ = TestCollectionBaseZ.merge(object({
  _id: string(),
}));

export type TestCollection = zinfer<typeof TestCollectionZ>;