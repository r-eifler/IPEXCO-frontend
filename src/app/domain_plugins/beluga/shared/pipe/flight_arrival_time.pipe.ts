import { Pipe, PipeTransform } from '@angular/core';
import { convertArrivalTime } from '../domain/flight_distribution';

function to2digests(value: number){
  if(value < 10){
    return "0" + value
  }
  return String(value)
}

@Pipe({
  name: 'flightArrivalTime',
  standalone: true
})
export class FlightArrivalTimePipe implements PipeTransform {

  transform(value: number | undefined){
    if(value === undefined || value === null) {
      return 'Unknown';
    }
    const converted = convertArrivalTime(value);
    return to2digests(converted.hours) + ":" + to2digests(converted.minutes)
  }

}
