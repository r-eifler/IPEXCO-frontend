import { BelugaAction, BelugaActionType } from "../../shared/domain/beluga_plan";
import { FlightTargetSchedule } from "./flight-section";

export enum ProgressStatus {
  DONE = "DONE",
  IN_PROGRESS = 'IN_PROGRESS',
  TODO = 'TODO',
  UNKNOWN = 'UNKNOWN'
}

export interface FlightStatus {
  name: string,
  originalIndex: number,
  status: ProgressStatus
}

export function getFlightPlanProgressStatus(actions: BelugaAction[], flights: FlightTargetSchedule[]){
    let flightIndex = 0
    let sections = flights.map(flight => ({
      name: flight.name,
      originalIndex: flight.originalIndex,
      status: ProgressStatus.UNKNOWN
    }));

    for(let a of actions){
      if(a.name == BelugaActionType.SWITCH_TO_NEXT_BELUGA){
        sections[flightIndex].status = ProgressStatus.DONE
        flightIndex++;
      }
      else{
        sections[flightIndex].status = ProgressStatus.IN_PROGRESS
      }
    }
    sections = sections.map(section => ({
      ...section,
      status: section.status == ProgressStatus.UNKNOWN ? ProgressStatus.TODO : section.status
    }))

    return sections
}