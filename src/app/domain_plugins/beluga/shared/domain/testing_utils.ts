import { BelugaAction } from "./beluga_plan";
import { Flight, ProductionLine } from "./beluga_problem";
import { applyAction, BelugaState } from "./beluga_state";
import { BelugaSiteSetUp } from "./site_set_up";

export function getActionLoop(
        actions: BelugaAction[],
        startState: BelugaState, 
        siteSetup: BelugaSiteSetUp,
        flights: Flight[],
        productionLines: ProductionLine[]
    ){

    let currentState: BelugaState = startState;

    const stateJSON =JSON.stringify(currentState)
    let seenStates: Set<string> = new Set();
    seenStates.add(stateJSON);

    let loopStartIndex = 0;
    for(let a of actions){
        let resState = applyAction(currentState, a, flights, productionLines, siteSetup)
        
        if(resState === undefined){
            return null
        }

        const stateJSON =JSON.stringify(resState)

        if(seenStates.has(stateJSON)){
            break;
        }

        seenStates.add(stateJSON);
        currentState = resState;
        loopStartIndex++;
    }

    const prefix = actions.slice(0, loopStartIndex)
    const loop = actions.slice(loopStartIndex, actions.length)

    return [prefix, loop]
}