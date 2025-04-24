import { BelugaAction } from "../../shared/domain/beluga_plan";
import { BelugaState } from "../../shared/domain/beluga_state";


export interface PlanSection{
    initialState: BelugaState | undefined;
    actions: BelugaAction[],
    finished: boolean,
}

export interface FlightSectionPlan{
    sections: PlanSection[],
}