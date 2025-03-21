import { Component, computed, input } from '@angular/core';
import { Jig } from '../../domain/beluga_problem';
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

  incoming = input<boolean>(true);

  icon = computed(() => this.incoming() ? 'flight_land' : 'flight_takeoff')

}
