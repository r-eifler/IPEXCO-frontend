import { PlanRunStatus, PlanRunStatusZ } from "src/app/iterative_planning/domain/plan";
import { array, boolean, nullable, number, object, optional, record, string, infer as zinfer } from "zod";
import { BelugaActionZ } from "../../shared/domain/beluga_plan";
import { BelugaProblem, Flight, FlightZ, ProductionLine, ProductionLineZ } from "../../shared/domain/beluga_problem";
import { applyActions } from "../../shared/domain/beluga_state";
import { BelugaSightSetUpZ, BelugaSightStateZ, getSightSetUp } from "../../shared/domain/sight_set_up";
import { PlanMethodZ } from "./plan_method";


export const FlightSectionBaseZ = object({
    flightIndex: number(),
    sightSetUp: BelugaSightSetUpZ,
    sightState: BelugaSightStateZ,
    flightScheduled: optional(FlightZ),
    productionLinesScheduled: optional(array(ProductionLineZ)),
    incomingRemaining: array(string()),
    outgoingLoaded: array(string()),
    productionLinesDelivered: record(string(),  array(string())),

    predecessorId: nullable(string()),
    treeId: string(),

    planMethod: optional(PlanMethodZ),
    actions: array(BelugaActionZ),
    status: PlanRunStatusZ,
    satisfiedProperties: array(string()).optional(),
    finished: boolean(),
})

export type FlightSectionBase = zinfer<typeof FlightSectionBaseZ>;

export const FlightSectionZ = FlightSectionBaseZ.merge(object({
        _id: string(),
        user: string(),
    })
);

export type FlightSection = zinfer<typeof FlightSectionZ>;

export const FlightPlanBranchZ = object({
    name: string(),
    sectionIdHead: string(),
})

export type FlightPlanBranch = zinfer<typeof FlightPlanBranchZ>;


export const FlightPlanTreeBaseZ = object({
    // sections: record(string(), FlightSectionZ),
    branches: array(FlightPlanBranchZ),
    selectedBranch: number(),
    selectedSectionId: nullable(string()),

    project: string()
})

export type FlightPlanTreeBase = zinfer<typeof FlightPlanTreeBaseZ>;


export const FlightPlanTreeZ = FlightPlanTreeBaseZ.merge(object({
        _id: string(),
        user: string(),
    })
);

export type FlightPlanTree = zinfer<typeof FlightPlanTreeZ>;


export function getFullState(section: FlightSection | undefined | null){
    if(section === undefined || section === null){
        return undefined;
    }
    return {
        ...section.sightState,
        flightIndex: section.flightIndex,
        incomingRemaining: section.incomingRemaining,
        outgoingLoaded: section.outgoingLoaded,
        productionLines: section.productionLinesDelivered
    }
}


export function projectTaskToSection(task: BelugaProblem, section: FlightSection | undefined, numFlights = 1){

    const state = getFullState(section);

    if(section === undefined || state === undefined){
        return undefined;
    }

    const consideredJigs = new Set<string>();

    for(let indexOffset = 0; indexOffset < numFlights; indexOffset++){
        task.flights[section.flightIndex + indexOffset].incoming.forEach(j => consideredJigs.add(j))
    }
    
    Object.values(state.racks).forEach(r => r.forEach(j => consideredJigs.add(j)));
    Object.values(state.trailers).forEach(j => {if(j !== null){consideredJigs.add(j)}});
    Object.values(state.hangars).forEach(j => {if(j !== null){consideredJigs.add(j)}});

    let productionLineProjections =  task.production_lines.map(
        pl => ({...pl, schedule: filterUpTo(pl.schedule.filter(j => ! state.productionLines[pl.name].includes(j)), consideredJigs)})
    );

    let projection: BelugaProblem = {
        jigs: Object.values(state.jigs).reduce((jigs, jig) => consideredJigs.has(jig.name) ? {...jigs, [jig.name]: jig} : jigs, {}),
        racks: task.racks.map(r => ({...r, jigs: state.racks[r.name]})),
        hangars: task.hangars.map(h => ({...h, jig: state.hangars[h.name]})),
        trailers_beluga: task.trailers_beluga.map(t => ({...t, jig: state.trailers[t.name]})),
        trailers_factory: task.trailers_factory.map(t => ({...t, jig: state.trailers[t.name]})),
        jig_types: task.jig_types,
        production_lines: productionLineProjections,
        flights: task.flights.slice(section.flightIndex, section.flightIndex + numFlights)
    }

    return projection;
}

function filterUpTo(collection: string[], considered: Set<string>){
    let res: string[] = [];
    for(let s of collection){
        if(considered.has(s)){
            res.push(s)
        }
        else{
            break;
        }
    }
    return res;
}

export function deriveSuccessor(section: FlightSection, flight: Flight, productionSchedule: ProductionLine[], sightSetUp){
    let newStartState = applyActions(
        getFullState(section), 
        section.actions, 
        section.flightScheduled !== undefined ? [section.flightScheduled] : [],  
        section.productionLinesScheduled ?? [], 
        section.sightSetUp
    );
    if (newStartState == undefined){
        return undefined;
    }
    let suc: FlightSectionBase = {
        flightIndex: section.flightIndex + 1,
        sightSetUp,
        sightState: {
            jigs: newStartState.jigs,
            racks: newStartState.racks,
            trailers: newStartState.trailers,
            hangars: newStartState.hangars,
        },
        flightScheduled: flight,
        productionLinesScheduled: productionSchedule,
        productionLinesDelivered: newStartState.productionLines,

        actions: [],
        incomingRemaining: [],
        outgoingLoaded: [],

        status: PlanRunStatus.PENDING,
        predecessorId: section._id,
        treeId: section.treeId,
        finished: false,
    }
    return suc;
}