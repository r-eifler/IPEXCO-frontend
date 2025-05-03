import { PlanRunStatus, PlanRunStatusZ } from "src/app/iterative_planning/domain/plan";
import { array, boolean, nullable, number, object, optional, record, string, infer as zinfer } from "zod";
import { BelugaActionZ } from "../../shared/domain/beluga_plan";
import { applyActions, BelugaStateZ } from "../../shared/domain/beluga_state";
import { PlanMethodTypeZ, PlanMethodZ } from "./plan_method";
import { BelugaProblem } from "../../shared/domain/beluga_problem";


export const FlightSectionBaseZ = object({
    flightIndex: number(),
    startState: BelugaStateZ,
    finished: boolean(),
    predecessorId: nullable(string()),
    treeId: string(),

    planMethod: optional(PlanMethodZ),
    actions: array(BelugaActionZ),
    status: PlanRunStatusZ,
    satisfiedProperties: array(string()).optional(),
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


export function projectTaskToSection(task: BelugaProblem, section: FlightSection, numFlights = 1){
    if(section.startState === undefined){
        return undefined;
    }

    const state = section.startState;

    const consideredJigs = new Set<string>();

    for(let indexOffset = 0; indexOffset < numFlights; indexOffset++){
        task.flights[section.flightIndex + indexOffset].incoming.forEach(j => consideredJigs.add(j))
    }
    
    Object.values(state.racks).forEach(r => r.forEach(j => consideredJigs.add(j)));
    Object.values(state.trailersBeluga).forEach(j => {if(j !== null){consideredJigs.add(j)}});
    Object.values(state.trailersFactory).forEach(j => {if(j !== null){consideredJigs.add(j)}});
    Object.values(state.hangars).forEach(j => {if(j !== null){consideredJigs.add(j)}});

    let productionLineProjections =  Object.values(state.productionLines).map(
        pl => ({...pl, schedule: filterUpTo(pl.schedule, consideredJigs)})
    );

    let projection: BelugaProblem = {
        jigs: Object.values(state.jigs).reduce((jigs, jig) => jig.name in consideredJigs ? {...jigs, [jig.name]: jig} : jigs, {}),
        racks: task.racks.map(r => ({...r, jigs: state.racks[r.name]})),
        hangars: task.hangars.map(h => ({...h, jig: state.hangars[h.name]})),
        trailers_beluga: task.trailers_beluga.map(t => ({...t, jig: state.trailersBeluga[t.name]})),
        trailers_factory: task.trailers_factory.map(t => ({...t, jig: state.trailersFactory[t.name]})),
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

export function deriveSuccessor(section: FlightSection, task: BelugaProblem){
    let newStartState = applyActions(section.startState, section.actions, task);
    if (newStartState == undefined){
        return undefined;
    }
    let suc: FlightSectionBase = {
        flightIndex: section.flightIndex + 1,
        startState: newStartState,
        status: PlanRunStatus.PENDING,
        finished: false,
        predecessorId: section._id,
        treeId: section.treeId,
        actions: []
    }
    return suc;
}