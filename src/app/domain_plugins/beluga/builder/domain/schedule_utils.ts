import { FlightTargetSchedule} from "../../flight-section-planning/domain/flight-section";

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
    // const index = schedule.outgoing.findIndex(e => e.jigType == jigType && !e.skip);
    // if(index === -1){
    //     return schedule;
    // }
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