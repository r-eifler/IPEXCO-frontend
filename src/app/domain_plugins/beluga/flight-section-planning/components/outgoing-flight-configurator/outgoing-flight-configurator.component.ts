import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Flight, Jig, JigType } from '../../../shared/domain/beluga_problem';
import { FlightTargetSchedule } from '../../domain/flight-section';
import { JigConfiguratorComponent } from '../jig-configurator/jig-configurator.component';
import { MatCardModule } from '@angular/material/card';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-outgoing-flight-configurator',
  imports: [
    MatButtonModule,
    MatIconModule,
    JigConfiguratorComponent,
    MatCardModule,
    TranslocoModule,
  ],
  templateUrl: './outgoing-flight-configurator.component.html',
  styleUrl: './outgoing-flight-configurator.component.scss'
})
export class OutgoingFlightConfiguratorComponent {
  
    originalFlight = input.required<Flight>();
    flightTargetSchedule = input.required<FlightTargetSchedule>();
    jigs = input.required<Record<string,Jig>>();
    jigTypes = input.required<Record<string,JigType>>();
    disabled = input<boolean>(false);

    conflictMembers = input<{
      jigType: string,
      flightName: string,
      position: number
    }[]>();
  
    // targetSchedule = output<FlightTargetSchedule>();
    change = output<{index: number, skip: boolean}>();
  
    schedule = computed(() => this.flightTargetSchedule()?.outgoing.map((elem, index) => ({
        jig: {
          name: undefined,
          empty: true,
          type: elem.jigType,
        },
        status: {
          skip: elem.skip,
          onSite: elem.onSite,
          inConflict: this.conflictMembers()?.find(g => g.position == index)
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
    
    setStatus(index: number, skip: boolean){
      this.change.emit({index, skip})
    }

}
