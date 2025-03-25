import { BelugaAction, BelugaActionType, DeliverToHangerZ, GetFromHangerZ, LoadBelugaZ, PickUpRackZ, PutDownRackZ, UnloadBelugaZ } from "./beluga_plan"
import { BelugaProblem, Jig, ProductionLine } from "./beluga_problem";

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

export function applyAction(state: BelugaState, action: BelugaAction, model: BelugaProblem): BelugaState | undefined{
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
    return undefined;
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