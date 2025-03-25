import { Component, computed, effect, input } from '@angular/core';
import { Jig, JigType } from '../../domain/beluga_problem';
import { MatIconModule } from '@angular/material/icon';
import { JigComponent } from '../jig/jig.component';

@Component({
  selector: 'app-beluga-flight',
  imports: [
    MatIconModule,
    JigComponent,
  ],
  templateUrl: './beluga-flight.component.html',
  styleUrl: './beluga-flight.component.scss'
})
export class BelugaFlightComponent {

  jigs = input.required<Jig[]>()
  jigTypes = input.required<Record<string,JigType>>();

  incoming = input<boolean>(true);
  schedule = input<string[]>();

  outgoingType = computed(() => {
    const schedule = this.schedule()
    console.log(schedule);
    if(schedule === undefined){
      return 'none';
    }
    return schedule.length > 0 ? schedule[0] : 'none'
  });

  numOutgoingJigs = computed(() => {
    const schedule = this.schedule()
    console.log(schedule);
    if(schedule === undefined){
      return '0';
    }
    return schedule.length - this.jigs()?.length
  });


  icon = computed(() => this.incoming() ? 'flight_land' : 'flight_takeoff')
}
