import { Component, computed, effect, input, output, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { JigComponent } from '../../../shared/components/jig/jig.component';
import { Jig, JigType } from '../../../shared/domain/beluga_problem';
import { convertArrivalTime } from '../../../shared/domain/flight_distribution';
import { FlightArrivalTimePipe } from '../../../shared/pipe/flight_arrival_time.pipe';
import { FlightTargetSchedule } from '../../domain/flight-section';
import { ProgressStatus } from '../../domain/utils';
import { JigConfiguratorComponent } from '../jig-configurator/jig-configurator.component';
import { InfoComponent } from 'src/app/shared/components/info/info/info.component';

interface Status {
  skip: boolean,
  onSite: boolean,
  inConflict: boolean
}


@Component({
  selector: 'app-multi-flight-configurator',
  imports: [
    MatCardModule,
    MatIconModule,
    FlightArrivalTimePipe,
    NgxChartsModule,
    JigConfiguratorComponent,
    InfoComponent,
  ],
  templateUrl: './multi-flight-configurator.component.html',
  styleUrl: './multi-flight-configurator.component.scss'
})
export class MultiFlightConfiguratorComponent {

    flights = input.required<FlightTargetSchedule[]>();
    jigs = input.required<Record<string,Jig>>();
    jigTypes = input.required<Record<string,JigType>>();

    conflictMembersLoad = input<{
        jigName: string,
        flightName: string,
        position: number
      }[]>([]);
    
    conflictMembersUnload = input<{
        jigName: string,
        flightName: string,
        position: number
      }[]>([]);

    disabled = input<boolean>(false);

    change = output<{flightIndex: number, incoming: boolean, index: number, skip: boolean}>();
  
    selectedFlightIndex = signal<number | null>(0);
    selectedDayIndex = signal<number | null>(0);

    flightsWithStatus = computed(() => this.flights()?.map((flight) => ({
      ...flight,
      inConflict: this.conflictMembersUnload()?.filter(g => g.flightName === flight.name).length > 0 ||
        this.conflictMembersLoad()?.filter(g => g.flightName === flight.name).length > 0,
      incoming: flight.incoming.map(e => ({
        jig: this.jigs()?.[e.jig],
        jigType: this.jigTypes()?.[this.jigs()?.[e.jig].type],
        status: {
          skip: e.skip,
          onSite: true,
          inConflict: this.conflictMembersUnload()?.find(g => g.jigName == e.jig && g.flightName === flight.name)
        }
      })),
      outgoing: flight.outgoing.map((e, index) => ({
        jigType: this.jigTypes()?.[e.jigType],
        jig: {
          name: undefined,
          empty: true,
          type: e.jigType,
        },
        status: {
          skip: e.skip,
          onSite: true,
          inConflict: this.conflictMembersLoad()?.find(g => g.position == index && g.flightName === flight.name)
        }
      }))
    })))
  
    isProbabilistic = computed(() => this.flights()?.[0]?.scheduled_arrival !== undefined)
  
    days = computed(() => {
      const days: (FlightTargetSchedule & any) [][] = [[]] // TODO fix type
      this.flightsWithStatus()?.forEach((flight, index) => {
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
  
    selectedFlight = computed(() => {
      let index = this.selectedFlightIndex();
      if(index == null || index > this.flights()?.length){
        return null;
      }
      return this.flightsWithStatus()?.[index]
    })
  
    selectFlightIndex(flightIndex: number, day: number | null){
      this.selectedDayIndex.set(day)
      this.selectedFlightIndex.set(flightIndex);
    }
  
    setStatusIncoming(index: number, skip: boolean){
        this.change.emit({
          flightIndex: this.selectedFlight()?.originalIndex ?? -1,
          incoming: true,
          index, 
          skip
        })
    }

    setStatusOutgoing(index: number, skip: boolean){
        this.change.emit({
          flightIndex: this.selectedFlight()?.originalIndex ?? - 1,
          incoming: false,
          index, 
          skip
        })
    }

    constructor(){
      effect(() => console.log(this.flightsWithStatus()))
    }

}
