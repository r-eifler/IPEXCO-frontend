import { ExplanationRunStatus, ExplanationRunStatusZ } from "src/app/iterative_planning/domain/explanation/explanations";
import { PlanRunStatus, PlanRunStatusZ } from "src/app/iterative_planning/domain/plan";
import { array, boolean, nullable, number, object, optional, record, string, infer as zinfer } from "zod";
import { BelugaAction, BelugaActionType, BelugaActionZ } from "../../shared/domain/beluga_plan";
import { BelugaProblem, Flight } from "../../shared/domain/beluga_problem";
import { applyActions, BelugaState } from "../../shared/domain/beluga_state";
import { BelugaGoalZ } from "../../shared/domain/properties";
import { BelugaSiteSetUpZ, BelugaSiteState, BelugaSiteStateZ, SiteStatus } from "../../shared/domain/site_set_up";
import { PlanMethodZ } from "./plan_method";
import { scheduled } from "rxjs";



export const FlightTargetScheduleZ = object({
    originalIndex: number(),
    name: string(),
    incoming: array(object({
        jig: string(),
        skip: boolean(),
    })),
    outgoing: array(object({
        jigType: string(),
        skip: boolean(),
        onSite: boolean(),
    })),
    scheduled_arrival: optional(number())
})

export type FlightTargetSchedule = zinfer<typeof FlightTargetScheduleZ>;

export function getConsideredFlightSchedule(flights: Record<number,FlightTargetSchedule>, indices: number[]){
    let orderedFlights = indices.map(index => flights[index])
    return getFlightSchedule(orderedFlights, false)
}

export function getFlightSchedule(flights: FlightTargetSchedule[], skipped: boolean){
    return flights.map(flight => ({
        name: flight.name,
        incoming: flight.incoming.filter(j => j.skip === skipped).map(j => j.jig),
        outgoing: flight.outgoing.filter(j => j.skip === skipped).map(j => j.jigType),
        stageType: 'flight' as const
    }));
}

export const ProductionLineTargetScheduleZ = object({
    name: string(),
    schedule: array(object({
        jig: string(),
        skip: boolean(),
        onSite: boolean(),
    }))
})

export function initialDeliveryStatuses(jigName: string, jigsOnSite: Set<string>, notBlocked: String[]){
    let onSite = jigsOnSite.has(jigName);
    return {
        skip: !onSite || ! notBlocked.includes(jigName),
        onSite
    }
}

export interface StatusScheduleElem {
    jig: string,
    skip: boolean,
    onSite: boolean,
}

// considered in reverse order, jig not on side should initially not be considered
export function initConsiderationStatusesNotOnSiteReverse(schedule: StatusScheduleElem[]){

    let res: StatusScheduleElem[] = []
    let allOnSite = true;

    for(let i = schedule.length - 1; i >= 0; i--){
        allOnSite = allOnSite && schedule[i].onSite
        if(!allOnSite){
            res = [schedule[i], ...res]
            continue;
        }
        res = [{
            ...schedule[i],
            skip: true,
        }, ...res]
    }
    return res
}


export type ProductionLineTargetSchedule = zinfer<typeof ProductionLineTargetScheduleZ>;

export function getConsideredProductionSchedule(productionLines: ProductionLineTargetSchedule[]){
    return getProductionSchedule(productionLines, false)
}

export function getProductionSchedule(productionLines: ProductionLineTargetSchedule[], skipped: boolean){
    return productionLines.map(pl => ({
        name: pl.name,
        schedule: pl.schedule.filter(j => j.skip === skipped).map(j => j.jig),
    }));
}

export const SimplePlanPropertyBaseZ = object({
    name: string(),
    definition: object({

    }),
  });
  
export type SimplePlanPropertyBase = zinfer<typeof SimplePlanPropertyBaseZ>;

export const ExplanationsZ = object({
    MUGS: array(array(string())),
    MUGScomplete: boolean(),
    MGCS: array(array(string())),
    MGCScomplete: boolean(),
    goals: record(string(), BelugaGoalZ)
})

export type Explanations = zinfer<typeof ExplanationsZ>;

export const BelugaConfigurationZ = object({
    siteSetUp: BelugaSiteSetUpZ,
    flightTargetSchedule: record(string(),FlightTargetScheduleZ),
    productionLinesTargetSchedule: record(string(),ProductionLineTargetScheduleZ),
    maxSwaps: nullable(number()),
    minEmptyRacks: nullable(number()),
    explanations: nullable(ExplanationsZ),
    explanationStatus: ExplanationRunStatusZ
})

export type BelugaConfiguration = zinfer<typeof BelugaConfigurationZ>;

export const FlightsHorizonBaseZ = object({
    predecessorId: nullable(string()),
    treeId: string(),

    flightIndices: array(number()),
    siteState: BelugaSiteStateZ,
    configurationIndex: number(),
    configurations: array(BelugaConfigurationZ),
    
    planMethod: optional(PlanMethodZ),
    actions: array(BelugaActionZ),
    status: PlanRunStatusZ,
    finished: boolean(),
})

export type FlightsHorizonBase = zinfer<typeof FlightsHorizonBaseZ>;

export const FlightsHorizonZ = FlightsHorizonBaseZ.merge(object({
        _id: string(),
        user: string(),
    })
);

export type FlightsHorizon = zinfer<typeof FlightsHorizonZ>;

export const FlightPlanBranchZ = object({
    name: string(),
    sectionIdHead: string(),
})

export type FlightPlanBranch = zinfer<typeof FlightPlanBranchZ>;


export const FlightPlanTreeBaseZ = object({
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


export function getFullStartState(section: FlightsHorizonBase){

    const config = section.configurations[section.configurationIndex];
    const state: BelugaState = {
        ...section.siteState,
        flightIndex: 0,
        incomingUnloaded: [],
        outgoingLoaded: [],
        productionLines: Object.keys(config.productionLinesTargetSchedule).reduce((acc, name) => ({...acc, [name]: []}),{})
    }
    return state;
}

export function getTaskFromSection(section: FlightsHorizon){

    const state = section.siteState;
    const config = section.configurations[section.configurationIndex];
    const setUp = config.siteSetUp;

    let task: BelugaProblem = {
        jigs: state.jigs,
        racks: setUp.racks.filter(r => r.status == SiteStatus.IN_USE).map(r => ({
            ...r, 
            jigs: state.racks[r.name],
        })),
        hangars: setUp.hangars.filter(h => h.status == SiteStatus.IN_USE).map(h => ({
            ...h, 
            jig: state.hangars[h.name],
        })),
        trailers_beluga: setUp.belugaTrailers.filter(h => h.status == SiteStatus.IN_USE).map(t => ({
            ...t, 
            jig: state.trailers[t.name],
        })),
        trailers_factory: setUp.factoryTrailers.filter(h => h.status == SiteStatus.IN_USE).map(t => ({
            ...t, 
            jig: state.trailers[t.name],
        })),
        jig_types: setUp.jig_types,
        production_lines: Object.values(config.productionLinesTargetSchedule).map(pl => ({
            ...pl,
            schedule: pl.schedule.filter(j => !j.skip).map(j => j.jig),
        })),
        flights: Object.values(config.flightTargetSchedule).map(flight => ({
            ...flight,
            incoming: flight.incoming.filter(j => !j.skip).map(j => j.jig),
            outgoing: flight.outgoing.filter(j => !j.skip).map(j => j.jigType),
        }))
    }
    return task;
}

export function projectTaskToSection(task: BelugaProblem, section: FlightsHorizon, numFlights = 1){

    const state = getFullStartState(section);

    if(section === undefined || state === undefined){
        return undefined;
    }

    projectTaskToState(task, state, section.flightIndices);
}


export function getJigsOnSiteFromState(state: BelugaSiteState, flights: {incoming: string[]}[]){

    const consideredJigs = new Set<string>();

    flights?.forEach(f => f.incoming.forEach(j => consideredJigs.add(j)))
    
    Object.values(state.racks).forEach(r => r.forEach(j => consideredJigs.add(j)));
    Object.values(state.trailers).forEach(j => {if(j !== null){consideredJigs.add(j)}});
    Object.values(state.hangars).forEach(j => {if(j !== null){consideredJigs.add(j)}});

    return consideredJigs;
}

export function getJigsOnSiteFromSection(section: FlightsHorizon){

    const config = section.configurations[section.configurationIndex];
    const consideredJigs = new Set<string>();

    Object.values(config.flightTargetSchedule).forEach( flight => flight.incoming.
        filter(e => !e.skip).
        forEach(e => consideredJigs.add(e.jig))
    );
    
    Object.values(section.siteState.racks).forEach(r => r.forEach(j => consideredJigs.add(j)));
    Object.values(section.siteState.trailers).forEach(j => {if(j !== null){consideredJigs.add(j)}});
    Object.values(section.siteState.hangars).forEach(j => {if(j !== null){consideredJigs.add(j)}});

    return consideredJigs;
}

export function projectTaskToState(task: BelugaProblem, state: BelugaState, flightIndices: number[]){

    const consideredJigs = getJigsOnSiteFromState(state, task.flights.filter((e,i) => flightIndices.includes(i)));

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
        flights: flightIndices.map(i => task.flights[i])
    }

    return projection;
}

export function filterUpTo(collection: string[], considered: Set<string>){
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

export function deriveSuccessorFlightHorizonFromPredecessor(
        section: FlightsHorizonBase, 
        flights: Flight[], 
        newFlightIndices: number[]
    ){
    const fullInitialState = getFullStartState(section);
    if(fullInitialState !== undefined){
        return deriveSuccessorFlightHorizon(
            section.predecessorId,
            section.treeId,
            fullInitialState, 
            section.actions,
            section.flightIndices,
            section.configurations[section.configurationIndex], 
            flights, 
            newFlightIndices)
    }
    else{
        return undefined
    }
}


export function deriveSuccessorFlightHorizon(
        predecessorId: string | null, 
        treeId: string, 
        state: BelugaState, 
        actions: BelugaAction[], 
        oldFlightIndices: number[], 
        config: BelugaConfiguration, 
        allFlights: Flight[], 
        newFlightIndices: number[]
    ){

    let newStartState = applyActions(
        state, 
        actions, 
        getConsideredFlightSchedule(config.flightTargetSchedule, oldFlightIndices),  
        getProductionSchedule(Object.values(config.productionLinesTargetSchedule) ?? [],false) , 
        config.siteSetUp
    );
    if (newStartState == undefined){
        return undefined;
    }

    const usedSortedFlights: (Flight & {originalIndex: number})[] = newFlightIndices.
        map(index => ({
            ...allFlights[index],
            originalIndex: index
        }))
    const jigsOnSite = getJigsOnSiteFromState(newStartState, usedSortedFlights)
    const jigTypesOnSite = [...jigsOnSite].map(jn => state.jigs[jn].type)

    let suc: FlightsHorizonBase = {
        predecessorId,
        treeId,

        flightIndices: newFlightIndices,
        siteState: {
            jigs: newStartState.jigs,
            racks: newStartState.racks,
            trailers: newStartState.trailers,
            hangars: newStartState.hangars,
        },
        
        configurationIndex: 0,
        configurations: [{
            siteSetUp: config.siteSetUp,
            flightTargetSchedule: usedSortedFlights.reduce((acc, flight) => ({
                ...acc,
                [flight.originalIndex]: { 
                    originalIndex: flight.originalIndex,
                    name: flight.name, 
                    incoming: flight.incoming.map(jn => ({ 
                        jig: jn, 
                        skip: false,
                    })), 
                    outgoing: flight.outgoing.map(jt => {
                        const index = jigTypesOnSite.findIndex(t => t === jt);
                        if(index !== -1){
                            jigTypesOnSite.splice(index,1)
                        }
                        return { 
                            jigType: jt, 
                            skip: false,
                            onSite: index !== -1,
                        }
                    }) 
                }
            }), {}),
            productionLinesTargetSchedule: Object.values(config.productionLinesTargetSchedule).reduce((acc,tpl) => { 
                const endDelivery = tpl.schedule.findLastIndex(e => newStartState.productionLines[tpl.name].includes(e.jig))
                const remainingSchedule = tpl.schedule.slice(endDelivery + 1)
                const toDeliver = remainingSchedule.map(e => e.jig)
                const notBlocked = filterUpTo(toDeliver, jigsOnSite)
                return {
                    ...acc, 
                    [tpl.name]: {
                        name: tpl.name, 
                        schedule: remainingSchedule.map(e => ({ 
                            jig: e.jig, 
                            ...initialDeliveryStatuses(e.jig, jigsOnSite, notBlocked)
                        }))
                }}
            }, {}),
            maxSwaps: config.maxSwaps,
            minEmptyRacks: config.minEmptyRacks,
            explanations: null,
            explanationStatus: ExplanationRunStatus.PENDING
        }],
        
        actions: [],
        status: PlanRunStatus.PENDING,
        finished: false,

    }

    console.log(suc);
    return suc;
}


export function getPrefixOfFlightHorizon(
        section: FlightsHorizon,
        prefix: number[]
    ){

    const config = section.configurations[section.configurationIndex]

    const fullInitialState = getFullStartState(section);

    const actions: BelugaAction[] = [];
    let  numFlights = prefix.length;
    for(let action of section.actions){
        if(action.name == BelugaActionType.SWITCH_TO_NEXT_BELUGA){
        numFlights--;
        }
        actions.push(action);
        if(numFlights == 0){
        break;
        }
    }

    const startState = getFullStartState(section);

    const jigsOnSite = getJigsOnSiteFromState(startState, Object.values(config.flightTargetSchedule).map(f => ({incoming: f.incoming.map(e => e.jig)})))
    const jigTypesOnSite = [...jigsOnSite].map(jn => fullInitialState.jigs[jn].type)

    let suc: FlightsHorizonBase = {
        predecessorId: section.predecessorId,
        treeId: section.treeId,

        flightIndices: prefix,
        siteState: {
            jigs: startState.jigs,
            racks: startState.racks,
            trailers: startState.trailers,
            hangars: startState.hangars,
        },
        
        configurationIndex: 0,
        configurations: [{
            siteSetUp: config.siteSetUp,
            flightTargetSchedule: Object.values(config.flightTargetSchedule).
                filter(f => prefix.includes(f.originalIndex)).reduce((acc, flight) => ({
                ...acc,
                [flight.originalIndex]: flight,
            }), {}),
            productionLinesTargetSchedule: Object.values(config.productionLinesTargetSchedule).reduce((acc,tpl) => { 
                const toDeliver = tpl.schedule.map(e => e.jig)
                const notBlocked = filterUpTo(toDeliver, jigsOnSite)
                return {
                    ...acc, 
                    [tpl.name]: {
                        name: tpl.name, 
                        schedule: tpl.schedule.map(e => ({ 
                            jig: e.jig, 
                            ...initialDeliveryStatuses(e.jig, jigsOnSite, notBlocked),
                            skip: e.skip,
                        }))
                }}
            }, {}),
            maxSwaps: config.maxSwaps,
            minEmptyRacks: config.minEmptyRacks,
            explanations: null,
            explanationStatus: ExplanationRunStatus.PENDING
        }],
        
        actions,
        planMethod: section.planMethod,
        status: PlanRunStatus.SOLVED,
        finished: false,

    }

    console.log(suc);
    return suc;
}


export function getBranchOfFlightHorizon(
        section: FlightsHorizon,
        allFlights: Flight[],
        horizon: number[]
    ){

    const config = section.configurations[section.configurationIndex]
    const startState = getFullStartState(section)
    const usedSortedFlights: (Flight & {originalIndex: number})[] = horizon.
        map(index => ({
            ...allFlights[index],
            originalIndex: index
        }))

    const jigsOnSite = getJigsOnSiteFromState(startState, usedSortedFlights)
    const jigTypesOnSite = [...jigsOnSite].map(jn => startState.jigs[jn].type)

    let suc: FlightsHorizonBase = {
        predecessorId: section.predecessorId,
        treeId: section.treeId,

        flightIndices: horizon,
        siteState: {
            jigs: startState.jigs,
            racks: startState.racks,
            trailers: startState.trailers,
            hangars: startState.hangars,
        },
        
        configurationIndex: 0,
        configurations: [{
            siteSetUp: config.siteSetUp,
            flightTargetSchedule: usedSortedFlights.reduce((acc, flight) => ({
                    ...acc,
                    [flight.originalIndex]: { 
                        originalIndex: flight.originalIndex,
                        name: flight.name, 
                        incoming: flight.incoming.map(jn => ({ 
                            jig: jn, 
                            skip: false,
                        })), 
                        outgoing: flight.outgoing.map(jt => {
                            const index = jigTypesOnSite.findIndex(t => t === jt);
                            if(index !== -1){
                                jigTypesOnSite.splice(index,1)
                            }
                            return { 
                                jigType: jt, 
                                skip: false,
                                onSite: index !== -1,
                            }
                        }) 
                    }
            }), {}),
            productionLinesTargetSchedule: Object.values(config.productionLinesTargetSchedule).reduce((acc,tpl) => { 
                const endDelivery = tpl.schedule.findLastIndex(e => startState.productionLines[tpl.name].includes(e.jig))
                const remainingSchedule = tpl.schedule.slice(endDelivery + 1)
                const toDeliver = remainingSchedule.map(e => e.jig)
                const notBlocked = filterUpTo(toDeliver, jigsOnSite)
                return {
                    ...acc, 
                    [tpl.name]: {
                        name: tpl.name, 
                        schedule: remainingSchedule.map(e => ({ 
                            jig: e.jig, 
                            ...initialDeliveryStatuses(e.jig, jigsOnSite, notBlocked)
                        }))
                }}
            }, {}),
            maxSwaps: config.maxSwaps,
            minEmptyRacks: config.minEmptyRacks,
            explanations: null,
            explanationStatus: ExplanationRunStatus.PENDING
        }],
        
        actions: [],
        status: PlanRunStatus.PENDING,
        finished: false,

    }

    console.log(suc);
    return suc;
}