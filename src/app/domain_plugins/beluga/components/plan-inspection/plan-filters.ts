import { BelugaActionType, JigActionZ } from "../../domain/beluga_plan";
import { DisplayAction } from "./plan-inspection.component";

export function actionsForFlight(actions: DisplayAction[], flight: number){
    const switchIndices: number[] = []
    
    actions.forEach((value,index) => {
        if(value.action.name == BelugaActionType.SWITCH_TO_NEXT_BELUGA){
            switchIndices.push(index);
        }
    });

    if(flight - 1 > switchIndices.length){
        return null
    }

   return actions.slice(flight >= 2 ? switchIndices[flight - 2] : 0,switchIndices[flight - 1] + 1);
}

export function actionsForJigs(actions: DisplayAction[], jigs: string[]){
    return actions.filter((a) => {
        if(a.action.name == BelugaActionType.SWITCH_TO_NEXT_BELUGA){
            return false;
        }

        const jigAction = JigActionZ.parse(a.action);
        return jigs.includes(jigAction.j);
    })
}