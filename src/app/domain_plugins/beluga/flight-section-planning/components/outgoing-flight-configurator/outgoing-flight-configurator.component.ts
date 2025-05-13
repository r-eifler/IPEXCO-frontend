import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Flight, Jig, JigType } from '../../../shared/domain/beluga_problem';
import { FlightTargetSchedule, GoalConsiderationStatus } from '../../domain/flight-section';
import { JigConfiguratorComponent } from '../jig-configurator/jig-configurator.component';

@Component({
  selector: 'app-outgoing-flight-configurator',
  imports: [
    MatButtonModule,
    MatIconModule,
    JigConfiguratorComponent,
  ],
  templateUrl: './outgoing-flight-configurator.component.html',
  styleUrl: './outgoing-flight-configurator.component.scss'
})
export class OutgoingFlightConfiguratorComponent {

    status = GoalConsiderationStatus;
  
    originalFlight = input.required<Flight>();
    flightTargetSchedule = input.required<FlightTargetSchedule>();
    jigs = input.required<Record<string,Jig>>();
    jigTypes = input.required<Record<string,JigType>>();
  
    targetSchedule = output<FlightTargetSchedule>();
  
    schedule = computed(() => this.flightTargetSchedule()?.outgoing.map(elem => ({
        jig: {
          name: 'XXX',
          empty: true,
          type: elem.jigType,
        },
        status: {
          considerationStatus: elem.considerationStatus,
          solvabilityStatus: elem.solvabilityStatus
        }
      }))
    )
  
    //   const newFlightSchedule = {
    //     name: this.originalFlight().name,
    //     incoming: this.flightTargetSchedule()?.incoming ?? [],
    //     outgoing: schedule
    //   }
  
    //   this.targetSchedule.emit(newFlightSchedule);
    // }
    
    setStatus(index: number, status: GoalConsiderationStatus){
      const schedule = this.flightTargetSchedule().outgoing
      const newFlightSchedule = {
        name: this.originalFlight().name,
        outgoing: [
          ...schedule.slice(0,index),
          {
            ...schedule[index],
            considerationStatus: status,
          },
          ...schedule.slice(index + 1)
        ],
        incoming: this.flightTargetSchedule()?.incoming ?? []
      }
  
      this.targetSchedule.emit(newFlightSchedule);
    }

}
