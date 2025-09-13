import { Component, computed, effect, input, signal, Signal } from '@angular/core';
import { Flight, Jig, JigType } from '../../domain/beluga_problem';
import { MatCardModule } from '@angular/material/card';
import { JigComponent } from '../jig/jig.component';
import { MatIconModule } from '@angular/material/icon';
import { FlightArrivalTimePipe } from '../../pipe/flight_arrival_time.pipe';
import { convertArrivalTime, delayDistribution } from '../../domain/flight_distribution';
import { NgxChartsModule } from '@swimlane/ngx-charts';

type DisplayFlight = Flight & {
  originalIndex: number;
}

@Component({
  selector: 'app-multi-flight-card',
  imports: [
    MatCardModule,
    JigComponent,
    MatIconModule,
    FlightArrivalTimePipe,
    NgxChartsModule,
  ],
  templateUrl: './multi-flight-card.component.html',
  styleUrl: './multi-flight-card.component.scss'
})
export class MultiFlightCardComponent {

  view: any[] = [700, 400];
  colorScheme = {
    domain: ['#070588ff', '#00aec7', '#a51890', '#da1884', '#e4002b', '#fe5000', '#e1e000', '#84bd00']
  };

  flights = input.required<Flight[]>();
  jigs = input.required<Record<string,Jig>>();
  jigTypes = input.required<Record<string,JigType>>();
  highlighted = input<number | null>(null);

  selectedFlightIndex = signal<number | null>(0);
  selectedDayIndex = signal<number | null>(0);

  displayFlights = computed(() => this.flights()?.map((flight, index) => ({
    ...flight,
    originalIndex: index
  })))

  isProbabilistic = computed(() => this.flights()?.[0]?.scheduled_arrival !== undefined)

  days = computed(() => {
    const days: DisplayFlight[][] = [[]]
    this.displayFlights()?.forEach(flight => {
      if(flight.scheduled_arrival === undefined){
        days[0].push(flight);
        return
      }
      const scheduled = convertArrivalTime(flight.scheduled_arrival);
      while(days.length - 1 < scheduled.days){
        days.push([])
      }
      days[scheduled.days].push(flight)  
    })
    return days;
  })

  selectedDay = computed(() => {
    const selected = this.selectedDayIndex()
    if(selected === null){
      return null
    }
    return this.days()?.[selected];
  })

  delayDistributionData = computed(() => {

    const flights = this.selectedDay()?.map(df => this.flights()?.[df.originalIndex]);
    if(flights == undefined || flights.length == 0 || flights[0].scheduled_arrival === undefined){
      return [];
    }

    const baseDistribution = delayDistribution;    

    const data: {name: string, series: {name: Date, value: number}[]}[] =
      flights.map(flight => {
        if(flight.scheduled_arrival === undefined){
          return null;
        }
        const flightData: {name: Date, value: number}[] = baseDistribution.
              filter(base => base[0] <= 3).
              map(base => {
              const time = convertArrivalTime(base[0] + (flight.scheduled_arrival ?? 0))
                return {
                name: new Date(0, 0, 0, time.hours, time.minutes),
                value: base[1]
                }
            });
        return {name: flight.name, series: flightData};
      }).filter(e => e !== null);
    console.log(data);
    return data;
  })

  selectedFlight = computed(() => {
    let index = this.selectedFlightIndex();
    if(index == null || index > this.flights()?.length){
      return null;
    }
    return this.flights()?.[index]
  })

  selectedIncoming = computed(() => this.selectedFlight()?.incoming.map(
    jigName => {
      let jig = this.jigs()?.[jigName];
      if(jig === undefined){
        console.error(jigName + " not known")
        return null
      }
      let type = this.jigTypes()?.[jig.type]
      return {jig, type}
    }).filter(e => e !== null))

  selectedOutgoing = computed(() => this.selectedFlight()?.outgoing.map(
    typeName => this.jigTypes()?.[typeName]))

  selectFlightIndex(flightIndex: number, day: number | null){
    this.selectedDayIndex.set(day)
    this.selectedFlightIndex.set(flightIndex);
  }

}
