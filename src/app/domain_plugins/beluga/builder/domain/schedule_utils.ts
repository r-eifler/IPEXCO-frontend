import { FlightTargetSchedule, ProductionLineTargetSchedule} from "../../flight-section-planning/domain/flight-section";
import { ProductionLine } from "../../shared/domain/beluga_problem";

function updateIncomingJigConsiderationStatus(jigName: string, schedule: FlightTargetSchedule, skip: boolean){
    const index = schedule.incoming.findIndex(e => e.jig == jigName);
    if(index === -1){
        return schedule;
    }
    return {
        ...schedule,
        incoming: [
            ...schedule.incoming.slice(0,index),
            {
                ...schedule.incoming[index],
                skip,
            },
            ...schedule.incoming.slice(index+1),
        ]
    }
}

export function updateSkipIncomingJig(jigName: string, schedule: FlightTargetSchedule){
    return updateIncomingJigConsiderationStatus(jigName, schedule, true)
}

export function updateConsiderIncomingJig(jigName: string, schedule: FlightTargetSchedule){
    return updateIncomingJigConsiderationStatus(jigName, schedule, false)
}

export function updateSkipOutgoingJigType(jigType: string, index: number, schedule: FlightTargetSchedule){
    return {
        ...schedule,
        outgoing: [
            ...schedule.outgoing.slice(0,index),
            {
                ...schedule.outgoing[index],
                skip: true
            },
            ...schedule.outgoing.slice(index+1),
        ]
    }
}


export function updateSkipProductionLineJig(jigName: string, productionLine: string, schedule: ProductionLineTargetSchedule[]){
    const plIndex = schedule.findIndex(pl => pl.name == productionLine);
    // if(plIndex === -1){
    //     return undefined
    // }
    const jigIndex = schedule[plIndex].schedule.findIndex(e => e.jig == jigName);
    // if(jigIndex === -1){
    //     return undefined
    // }
    const toChangeSchedule = schedule[plIndex];
    return [
        ...schedule.slice(0,plIndex),
        {
            name: toChangeSchedule.name,
            schedule: [
                ...toChangeSchedule.schedule.slice(0,jigIndex),
            {
                ...toChangeSchedule.schedule[jigIndex],
                skip: true
            },
            ...toChangeSchedule.schedule.slice(jigIndex+1),
            ]
        },
        ...schedule.slice(plIndex+1),
    ]
}


export function unSkipNotDelivered(schedules: ProductionLineTargetSchedule[], state: Record<string,string[]>){
    return schedules.map((s) => {
        const indexLastDelivered = s.schedule.findIndex(e => e.jig === state[s.name][-1]);
        return {
            ...s,
            schedule: s.schedule.map((e, index) => ({
                ...e,
                skip: index <= indexLastDelivered ? e.skip : false 
            }))
        }
    })
}

export function skipNotDelivered(schedules: ProductionLineTargetSchedule[], state: Record<string,string[]>){
    return schedules.map((s) => {
        const delivered = state[s.name];
        return {
            ...s,
            schedule: s.schedule.map(e => ({
                ...e,
                skip: ! delivered.includes(e.jig)
            }))
        }
    })
}