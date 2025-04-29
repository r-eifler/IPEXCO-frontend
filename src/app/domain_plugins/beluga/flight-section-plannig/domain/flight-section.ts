import { PlanRunStatusZ } from "src/app/iterative_planning/domain/plan";
import { array, boolean, nullable, number, object, optional, record, string, infer as zinfer } from "zod";
import { BelugaActionZ } from "../../shared/domain/beluga_plan";
import { BelugaStateZ } from "../../shared/domain/beluga_state";


export const FlightSectionZ = object({
    nodeId: string(),
    flightIndex: number(),
    startState: optional(BelugaStateZ),
    finished: boolean(),
    predecessor: nullable(string()),
    successor: nullable(string()),

    actions: array(BelugaActionZ),
    status: PlanRunStatusZ,
    satisfiedProperties: array(string()).optional(),
})

export type FlightSection = zinfer<typeof FlightSectionZ>;

export const FlightPlanTreeZ = object({
    root: nullable(string()),
    sections: record(string(),FlightSectionZ),
    selectedLeave: nullable(string()),
})

export type FlightPlanTree = zinfer<typeof FlightPlanTreeZ>;


export const FlightPlanForestZ = object({
    trees: array(FlightPlanTreeZ),
    project: string()
})

export type FlightPlanForest = zinfer<typeof FlightPlanForestZ>;
