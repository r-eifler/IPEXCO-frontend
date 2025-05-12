import { PlanRunStatus, PlanRunStatusZ } from "src/app/iterative_planning/domain/plan";
import { array, boolean, nativeEnum, nullable, number, object, optional, record, string, infer as zinfer } from "zod";
import { BelugaActionZ } from "../../shared/domain/beluga_plan";
import { BelugaProblem, Flight, ProductionLine, ProductionLineZ } from "../../shared/domain/beluga_problem";
import { applyActions, BelugaState } from "../../shared/domain/beluga_state";
import { BelugaSiteSetUpZ, BelugaSiteStateZ, SiteStatus } from "../../shared/domain/site_set_up";
import { PlanMethodZ } from "./plan_method";


export enum GoalStatus {
    SOFT = "SOFT",
    HARD = "HARD"
  }
  
export const GoalStatusZ = nativeEnum(GoalStatus);

export const FlightTargetScheduleZ = object({
    name: string(),
    incoming: array(object({
        jig: string(),
        status: GoalStatusZ
    })),
    outgoing: array(object({
        jigType: string(),
        status: GoalStatusZ
    })),
})

export type FlightTargetSchedule = zinfer<typeof FlightTargetScheduleZ>;

export function getFlightSchedule(flight: FlightTargetSchedule, status: GoalStatus | null){
    return {
        name: flight.name,
        incoming: flight.incoming.filter(j => j.status === status).map(j => j.jig),
        outgoing: flight.outgoing.filter(j => status === null || j.status === status).map(j => j.jigType),
        stageType: 'flight' as const
    }
}

export const ProductionLineTargetScheduleZ = object({
    name: string(),
    schedule: array(object({
        jig: string(),
        status: GoalStatusZ
    }))
})


export type ProductionLineTargetSchedule = zinfer<typeof ProductionLineTargetScheduleZ>;

export function getProductionSchedule(productionLines: ProductionLineTargetSchedule[], status: GoalStatus | null){
    return productionLines.map(pl => ({
        name: pl.name,
        schedule: pl.schedule.filter(j => status === null || j.status === status).map(j => j.jig),
    }));
}


export const FlightSectionBaseZ = object({
    flightIndex: number(),
    siteSetUp: BelugaSiteSetUpZ,
    siteState: BelugaSiteStateZ,

    incomingUnloaded: array(string()),
    outgoingLoaded: array(string()),
    productionLinesDelivered: record(string(),  array(string())),

    flightTargetSchedule: FlightTargetScheduleZ,
    productionLinesTargetSchedule: array(ProductionLineTargetScheduleZ),
    maxSwaps: nullable(number()),
    minEmptyRacks: nullable(number()),

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
        ...section.siteState,
        flightIndex: section.flightIndex,
        incomingUnloaded: section.incomingUnloaded,
        outgoingLoaded: section.outgoingLoaded,
        productionLines: section.productionLinesDelivered
    }
}

export function getTaskFromSection(section: FlightSection){

    const state = section.siteState;
    const setUp = section.siteSetUp;

    let task: BelugaProblem = {
        jigs: state.jigs,
        racks: setUp.racks.filter(r => r.status == SiteStatus.IN_USE).map(r => ({
            ...r, 
            jigs: state.racks[r.name],
            stageType: "rack",
        })),
        hangars: setUp.hangars.filter(h => h.status == SiteStatus.IN_USE).map(h => ({
            ...h, 
            jig: state.hangars[h.name],
            stageType: "hangar",
        })),
        trailers_beluga: setUp.belugaTrailers.filter(h => h.status == SiteStatus.IN_USE).map(t => ({
            ...t, 
            jig: state.trailers[t.name],
            stageType: "trailer",
        })),
        trailers_factory: setUp.factoryTrailers.filter(h => h.status == SiteStatus.IN_USE).map(t => ({
            ...t, 
            jig: state.trailers[t.name],
            stageType: "trailer",
        })),
        jig_types: setUp.jig_types,
        production_lines: section.productionLinesTargetSchedule.map(pl => ({
            ...pl,
            schedule: pl.schedule.filter(j => j.status == GoalStatus.HARD).map(j => j.jig),
        })),
        flights: [{
            ...section.flightTargetSchedule,
            incoming: section.flightTargetSchedule.incoming.filter(j => j.status == GoalStatus.HARD).map(j => j.jig),
            outgoing: section.flightTargetSchedule.outgoing.filter(j => j.status == GoalStatus.HARD).map(j => j.jigType),
            stageType: 'flight'
        }]
    }
    return task;
}

export function projectTaskToSection(task: BelugaProblem, section: FlightSection, numFlights = 1){

    const state = getFullState(section);

    if(section === undefined || state === undefined){
        return undefined;
    }

    projectTaskToState(task, state, section.flightIndex, numFlights = 1);
}


export function projectTaskToState(task: BelugaProblem, state: BelugaState, flightIndex: number, numFlights = 1){

    const consideredJigs = new Set<string>();

    for(let indexOffset = 0; indexOffset < numFlights; indexOffset++){
        task.flights[flightIndex + indexOffset].incoming.forEach(j => consideredJigs.add(j))
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
        flights: task.flights.slice(flightIndex, flightIndex + numFlights)
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

export function deriveSuccessor(section: FlightSection, flight: Flight, productionSchedule: ProductionLine[], siteSetUp){
    let newStartState = applyActions(
        getFullState(section), 
        section.actions, 
        section.flightTargetSchedule !== undefined ? [getFlightSchedule(section.flightTargetSchedule, GoalStatus.HARD)] : [],  
        getProductionSchedule(section.productionLinesTargetSchedule ?? [], GoalStatus.HARD) , 
        section.siteSetUp
    );
    if (newStartState == undefined){
        return undefined;
    }
    let suc: FlightSectionBase = {
        flightIndex: section.flightIndex + 1,
        siteSetUp: siteSetUp,
        siteState: {
            jigs: newStartState.jigs,
            racks: newStartState.racks,
            trailers: newStartState.trailers,
            hangars: newStartState.hangars,
        },
        
        
        flightTargetSchedule: { name: flight.name, incoming: flight.incoming.map(jn => ({ jig: jn, status: GoalStatus.HARD })), outgoing: flight.outgoing.map(jn => ({ jigType: jn, status: GoalStatus.HARD })) },
        productionLinesTargetSchedule: productionSchedule.map(pl => ({ name: pl.name, schedule: pl.schedule.map(j => ({ jig: j, status: GoalStatus.HARD })) })),
        maxSwaps: null,
        minEmptyRacks: null,

        actions: [],

        productionLinesDelivered: newStartState.productionLines,
        incomingUnloaded: [],
        outgoingLoaded: [],

        status: PlanRunStatus.PENDING,
        predecessorId: section._id,
        treeId: section.treeId,
        finished: false
    }
    return suc;
}