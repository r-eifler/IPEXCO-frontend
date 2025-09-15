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

  flightTargetSchedule = input.required<FlightTargetSchedule>();
  jigs = input.required<Record<string,Jig>>();
  jigTypes = input.required<Record<string,JigType>>();
  disabled = input<boolean>(false);

  conflictMembers = input<{
    jigName: string,
    flightName: string,
    position: number
  }[]>([]);

  change = output<{index: number, skip: boolean}>();

  schedule = computed(() => this.flightTargetSchedule()?.incoming.map(e => ({
        jig: this.jigs()?.[e.jig],
        status: {
          skip: e.skip,
          onSite: true,
          inConflict: this.conflictMembers()?.find(g => g.jigName == e.jig)
        }
      }))
  )
  
  setStatus(index: number, skip: boolean){
    this.change.emit({index, skip})
  }

}


