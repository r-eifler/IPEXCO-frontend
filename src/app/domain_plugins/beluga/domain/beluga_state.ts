import { BelugaAction, BelugaActionType, DeliverToHangerZ, GetFromHangerZ, LoadBelugaZ, PickUpRackZ, PutDownRackZ, UnloadBelugaZ } from "./beluga_plan";
import { BelugaProblem, getJigSize, getRackSize, Jig, occupiedSpace, ProductionLine } from "./beluga_problem";

export interface BelugaState {
    jigs: Record<string, Jig>
    flightIndex: number,
    incoming: string[],
    outgoing: string[],
    racks: Record<string, string[]>,
    trailersBeluga: Record<string, string|null>,
    trailersFactory: Record<string, string|null>,
    hangars: Record<string, string|null>,
    productionLines: Record<string, ProductionLine>,
}

export function getInitialState(model: BelugaProblem) {
    return {
        jigs: model.jigs,
        flightIndex: 0,
        incoming: model.flights[0].incoming,
        outgoing: [],
        trailersBeluga: model.trailers_beluga.reduce((acc,c) => ({...acc, [c.name]: null}), {}),
        trailersFactory: model.trailers_factory.reduce((acc,c) => ({...acc, [c.name]: null}), {}),
        racks: model.racks.reduce((acc,c) => ({...acc, [c.name]: [...c.jigs]}), {}),
        hangars: model.hangars.reduce((acc,c) => ({...acc, [c]: null}), {}),
        productionLines: model.production_lines.reduce((acc,c) => ({...acc,[c.name]: c}), {})
      }
}

export function isApplicable(state: BelugaState, action: BelugaAction, model: BelugaProblem): boolean{
    switch(action.name){
        case BelugaActionType.SWITCH_TO_NEXT_BELUGA:
            return state.incoming.length == 0 && 
                state.outgoing.length == model.flights[state.flightIndex].outgoing.length
        case BelugaActionType.DELIVER_TO_HANGAR:
            let da = DeliverToHangerZ.parse(action);
            return state.hangars[da.h] == null && 
                state.trailersFactory[da.t] == da.j &&
                ! state.jigs[da.j].empty &&
                state.productionLines[da.pl].schedule[0] == da.j
        case BelugaActionType.GET_FROM_HANGAR:
            let ga = GetFromHangerZ.parse(action);
            return state.hangars[ga.h] == ga.j && 
            state.trailersFactory[ga.t] == null 
        case BelugaActionType.LOAD_BELUGA:
            let lba = LoadBelugaZ.parse(action);
            return state.trailersBeluga[lba.t] == lba.j &&
                state.outgoing.length < model.flights[state.flightIndex].outgoing.length &&
                model.flights[state.flightIndex].outgoing[0] == state.jigs[lba.j].type
        case BelugaActionType.UNLOAD_BELUGA:
            let uba = UnloadBelugaZ.parse(action);
            return state.incoming.length > 0 && state.incoming[0] == uba.j &&
                state.trailersBeluga[uba.t] == null 
        case BelugaActionType.PICK_UP_RACK:
            let pua = PickUpRackZ.parse(action);
            if(pua.s === 'bside'){
                return state.racks[pua.r].length > 0 && 
                    state.racks[pua.r][0] == pua.j &&
                    state.trailersBeluga[pua.t] == null
            }
            else{
                return state.racks[pua.r].length > 0 && 
                    state.racks[pua.r][state.racks[pua.r].length-1] == pua.j &&
                    state.trailersFactory[pua.t] == null
            }
        case BelugaActionType.PUT_DOWN_RACK:
            let pda = PutDownRackZ.parse(action);
            let rackSize = getRackSize(pda.r, model);
            let jig_size = getJigSize( state.jigs[pda.j], model.jig_types[state.jigs[pda.j].type])
            if(pda.s === 'bside'){
                return rackSize !== undefined && 
                rackSize - occupiedSpace(state.racks[pda.r], state.jigs, model.jig_types) >= jig_size &&
                state.trailersBeluga[pda.t] == pda.j
            }
            else{
                return rackSize !== undefined && 
                rackSize - occupiedSpace(state.racks[pda.r], state.jigs, model.jig_types) >= jig_size &&
                state.trailersFactory[pda.t] == pda.j
            }        
    }
}


export function applyAction(state: BelugaState, action: BelugaAction, model: BelugaProblem): BelugaState | undefined{
    if(!isApplicable(state, action, model)){
        console.log("Action: " + action.name + " is not applicable!")
        return undefined;
    }
    switch(action.name){
        case BelugaActionType.SWITCH_TO_NEXT_BELUGA:
            return {
                ...state,
                flightIndex: state.flightIndex + 1,
                outgoing: [],
                incoming: model.flights[state.flightIndex + 1].incoming
            }
        case BelugaActionType.DELIVER_TO_HANGAR:
            let da = DeliverToHangerZ.parse(action);
            return {
                ...state,
                trailersFactory: {...state.trailersFactory, [da.t]: null},
                hangars: {...state.hangars, [da.h]: da.j},
                jigs: {...state.jigs, [da.j]: {...state.jigs[da.j], empty: true}},
                productionLines: {...state.productionLines, [da.pl]: 
                    {
                        ...state.productionLines[da.pl],
                        schedule: state.productionLines[da.pl].schedule.filter(e => e !== da.j)
                }}

            }
        case BelugaActionType.GET_FROM_HANGAR:
            let ga = GetFromHangerZ.parse(action);
            return {
                ...state,
                trailersFactory: {...state.trailersFactory, [ga.t]: ga.j},
                hangars: {...state.hangars, [ga.h]: null}
            }
        case BelugaActionType.LOAD_BELUGA:
            let lba = LoadBelugaZ.parse(action);
            return {
                ...state,
                outgoing: [...state.outgoing, lba.j], 
                trailersBeluga: {...state.trailersBeluga, [lba.t]: null},
            }
        case BelugaActionType.UNLOAD_BELUGA:
            let uba = UnloadBelugaZ.parse(action);
            return {
                ...state,
                incoming: state.incoming.filter(j => j !== uba.j), 
                trailersBeluga: {...state.trailersBeluga, [uba.t]: uba.j},
            }
        case BelugaActionType.PICK_UP_RACK:
            let pua = PickUpRackZ.parse(action);
            if(pua.s === 'bside'){
                return {
                    ...state,
                    racks: {...state.racks, [pua.r]: state.racks[pua.r].filter(j => j !== pua.j)}, 
                    trailersBeluga: {...state.trailersBeluga, [pua.t]: pua.j},
                }
            }
            else{
                return {
                    ...state,
                    racks: {...state.racks, [pua.r]: state.racks[pua.r].filter(j => j !== pua.j)}, 
                    trailersFactory: {...state.trailersFactory, [pua.t]: pua.j},
                }
            }
        case BelugaActionType.PUT_DOWN_RACK:
            let pda = PutDownRackZ.parse(action);
            if(pda.s === 'bside'){
                return {
                    ...state,
                    racks: {...state.racks, [pda.r]: [pda.j, ...state.racks[pda.r]]}, 
                    trailersBeluga: {...state.trailersBeluga, [pda.t]: null},
                }
            }
            else{
                return { 
                    ...state,
                    racks: {...state.racks, [pda.r]: [...state.racks[pda.r],pda.j]}, 
                    trailersFactory: {...state.trailersFactory, [pda.t]: null},
                }
            }        
    }
}

export function applyActions(state: BelugaState, actions: BelugaAction[], model: BelugaProblem) {
    let cs: BelugaState | undefined = state;
    for(let action of actions){
        if(cs == undefined){
            return undefined
        }
        cs = applyAction(cs,action, model);
    }
    return cs
}