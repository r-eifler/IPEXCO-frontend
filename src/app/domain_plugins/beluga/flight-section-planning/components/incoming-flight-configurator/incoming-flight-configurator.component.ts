import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Flight, Jig, JigType } from '../../../shared/domain/beluga_problem';
import { FlightTargetSchedule } from '../../domain/flight-section';
import { JigConfiguratorComponent } from '../jig-configurator/jig-configurator.component';
import { MatCardModule } from '@angular/material/card';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-incoming-flight-configurator',
  imports: [
    MatButtonModule,
    MatIconModule,
    JigConfiguratorComponent,
    MatCardModule,
    TranslocoModule,
  ],
  templateUrl: './incoming-flight-configurator.component.html',
  styleUrl: './incoming-flight-configurator.component.scss'
})
export class IncomingFlightConfiguratorComponent {

  originalFlight = input.required<Flight>();
  flightTargetSchedule = input.required<FlightTargetSchedule>();
  jigs = input.required<Record<string,Jig>>();
  jigTypes = input.required<Record<string,JigType>>();
  disabled = input<boolean>(false);

  conflictMembers = input<{
    jigName: string,
    flightName: string,
    position: number
  }[]>([]);

  targetSchedule = output<FlightTargetSchedule>();

  schedule = computed(() => this.flightTargetSchedule()?.incoming.map(e => ({
        jig: this.jigs()?.[e.jig],
        status: {
          skip: e.skip,
          onSite: true,
          inConflict: this.conflictMembers()?.find(g => g.jigName == e.jig)
        }
      }))
  )
    

  // drop(event: CdkDragDrop<string[]>) {
  //   const schedule = this.schedule();
  //   moveItemInArray(schedule, event.previousIndex, event.currentIndex);
  //   console.log(schedule)

  //   const newFlightSchedule = {
  //     name: this.originalFlight().name,
  //     incoming: schedule.map(e => ({jig: e.jig.name, status: e.status})),
  //     outgoing: this.flightTargetSchedule()?.outgoing ?? []
  //   }

  //   this.targetSchedule.emit(newFlightSchedule);
  // }
  
  setStatus(index: number, skip: boolean){
    const newFlightSchedule = {
      name: this.flightTargetSchedule().name,
      incoming: [
        ...this.flightTargetSchedule().incoming.slice(0,index),
        {
          ...this.flightTargetSchedule().incoming[index],
          skip,
        },
        ...this.flightTargetSchedule().incoming.slice(index + 1)
      ],
      outgoing: this.flightTargetSchedule()?.outgoing ?? []
    }

    this.targetSchedule.emit(newFlightSchedule);
  }

}


