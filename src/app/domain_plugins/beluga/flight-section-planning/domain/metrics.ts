import { sum } from "ramda";
import { BelugaAction, BelugaActionType } from "../../shared/domain/beluga_plan";
import { BelugaProblem } from "../../shared/domain/beluga_problem";
import { applyAction, BelugaState } from "../../shared/domain/beluga_state";
import { FlightSection } from "./flight-section";

export enum MetricType {
    PLAN_LENGTH = "plan length",
    NUM_SWAPS = "number of swaps",
    RACK_OCCUPANCY = "rack occupancy"
}

export function computeSwaps(actions: BelugaAction[]){
    let num_swaps = 0;
    let candidates = new Set<string>();
    for(let action of actions){
        if(action.name == BelugaActionType.PICK_UP_RACK){
            candidates.add(action.j)
        }
        if(action.name == BelugaActionType.PUT_DOWN_RACK){
            if(candidates.has(action.j)){
                num_swaps += 1;
            }
        }
        if(action.name == BelugaActionType.DELIVER_TO_HANGAR || action.name == BelugaActionType.LOAD_BELUGA){
            candidates.delete(action.j)
        }
    }
    return num_swaps;
}

export function computeRackOccupancyRate(task: BelugaProblem, initState: BelugaState, actions: BelugaAction[]){
    let cs: BelugaState | undefined = initState;
    let numUsedRacks: number[] = []
    for(let action of actions){
        if(cs == undefined){
            return undefined;
        }
        numUsedRacks.push(computeRackOccupancyRateForState(cs));
        cs = applyAction(cs, action, task);
    }
    return sum(numUsedRacks)/(numUsedRacks.length)
}

export function computeRackOccupancyRateForState(state: BelugaState){
    return Object.values(state.racks).reduce((numUsed, jigs) => jigs.length == 0 ? numUsed : numUsed + 1, 0);
}

export function computePlanLength(actions: BelugaAction[]){
    return actions?.length ?? 0
}

export const metricsFunctionMap = {
    [MetricType.PLAN_LENGTH]: (section: FlightSection, task: BelugaProblem) => computePlanLength(section.actions),
    [MetricType.NUM_SWAPS]: (section: FlightSection, task: BelugaProblem) => computeSwaps(section.actions),
    [MetricType.RACK_OCCUPANCY]: (section: FlightSection, task: BelugaProblem) => computeRackOccupancyRate(task, section.startState, section.actions),
}