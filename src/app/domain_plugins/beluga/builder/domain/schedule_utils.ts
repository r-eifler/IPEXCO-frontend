import { FlightTargetSchedule, ProductionLineTargetSchedule} from "../../flight-section-planning/domain/flight-section";
import { ProductionLine } from "../../shared/domain/beluga_problem";

function updateIncomingJigConsiderationStatus(jigName: string, flightIndex: number, flights: Record<number,FlightTargetSchedule>, skip: boolean){
    const index = flights[flightIndex].incoming.findIndex(e => e.jig == jigName);
    if(index === -1){
        return flights;
    }
    return {
        ...flights,
        [flightIndex]:{
            ...flights[flightIndex],
            incoming: [
                ...flights[flightIndex].incoming.slice(0,index),
                {
                    ...flights[flightIndex].incoming[index],
                    skip: true
                },
                ...flights[flightIndex].incoming.slice(index+1),
            ]
        }
    }
}

export function updateSkipIncomingJig(jigName: string, flightIndex: number, flights: Record<number,FlightTargetSchedule>){
    return updateIncomingJigConsiderationStatus(jigName, flightIndex, flights, true)
}

export function updateConsiderIncomingJig(jigName: string, flightIndex: number, flights: Record<number,FlightTargetSchedule>){
    return updateIncomingJigConsiderationStatus(jigName, flightIndex, flights, false)
}

export function updateSkipOutgoingJigType(jigType: string, jigIndex: number, flightIndex: number, flights: Record<number,FlightTargetSchedule>){
    return {
        ...flights,
        [flightIndex]:{
            ...flights[flightIndex],
            outgoing: [
                ...flights[flightIndex].outgoing.slice(0,jigIndex),
                {
                    ...flights[flightIndex].outgoing[jigIndex],
                    skip: true
                },
                ...flights[flightIndex].outgoing.slice(jigIndex+1),
            ]
        }
    }
}


export function updateSkipProductionLineJig(jigName: string, productionLineName: string, schedule: Record<string, ProductionLineTargetSchedule>){
    const jigIndex = schedule[productionLineName].schedule.findIndex(e => e.jig == jigName);

    return {
        ...schedule,
        [productionLineName]: {
            ...schedule[productionLineName],
            schedule: [
                ...schedule[productionLineName].schedule.slice(0,jigIndex),
            {
                ...schedule[productionLineName].schedule[jigIndex],
                skip: true
            },
            ...schedule[productionLineName].schedule.slice(jigIndex+1),
            ]
        }
    }
}


export function unSkipNotDelivered(schedules: ProductionLineTargetSchedule[], state: Record<string,string[]>){
    return schedules.reduce((acc, s) => {
        const indexLastDelivered = s.schedule.findIndex(e => e.jig === state[s.name][-1]);
        return {
            ...acc, 
            [s.name]: {
            ...s,
            schedule: s.schedule.map((e, index) => ({
                ...e,
                skip: index <= indexLastDelivered ? e.skip : false 
            }))
        }}
    }, {})
}

export function skipNotDelivered(schedules: Record<string,ProductionLineTargetSchedule>, state: Record<string,string[]>){
    return Object.values(schedules).reduce((acc, s) => {
        const delivered = state[s.name];
        return {
            ...acc, 
            [s.name]: {
                ...s,
                schedule: s.schedule.map(e => ({
                    ...e,
                    skip: ! delivered.includes(e.jig)
                }))
            }
        }
    }, {})
}