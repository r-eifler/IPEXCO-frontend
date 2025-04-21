import { BelugaAction } from "../../shared/domain/beluga_plan";


export interface PlanSection{
    actions: BelugaAction[],
    finished: boolean,
}

export interface FlightSectionPlan{
    sections: PlanSection[],
}