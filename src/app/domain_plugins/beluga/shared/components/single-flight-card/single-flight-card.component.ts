import { Component, computed, effect, input } from '@angular/core';
import { Jig, JigType } from '../../domain/beluga_problem';
import { MatIconModule } from '@angular/material/icon';
import { JigComponent } from '../jig/jig.component';
import { MatCardModule } from '@angular/material/card';
import { TranslocoModule } from '@jsverse/transloco';
import { JigStatusComponent } from '../jig-status/jig-status.component';
import { InfoComponent } from 'src/app/shared/components/info/info/info.component';

@Component({
  selector: 'app-single-flight-card',
  imports: [
    MatIconModule,
    MatCardModule,
    TranslocoModule,
    JigStatusComponent,
    InfoComponent
  ],
  templateUrl: './single-flight-card.component.html',
  styleUrl: './single-flight-card.component.scss'
})
export class SingleFlightCardComponent {

  jigs = input.required<Jig[]>()
  jigTypes = input.required<Record<string,JigType>>();

  incoming = input<boolean>(true);
  schedule = input<string[]>();

  outgoingType = computed(() => {
    const schedule = this.schedule()
    if(schedule === undefined){
      return 'none';
    }
    return schedule.length > 0 ? schedule[0] : 'none'
  });

  numOutgoingJigs = computed(() => {
    const schedule = this.schedule()
    if(schedule === undefined){
      return '0';
    }
    return schedule.length - this.jigs()?.length
  });


  icon = computed(() => this.incoming() ? 'flight_land' : 'flight_takeoff')

  constructor(){
    effect(() => console.log(this.jigs()))
  }
}
