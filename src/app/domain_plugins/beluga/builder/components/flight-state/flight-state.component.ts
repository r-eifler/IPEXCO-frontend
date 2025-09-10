import { Component } from '@angular/core';
import { IncomingFlightStateComponent } from '../incoming-flight-state/incoming-flight-state.component';
import { OutgoingFlightStateComponent } from '../outgoing-flight-state/outgoing-flight-state.component';

@Component({
  selector: 'app-flight-state',
  imports: [
    IncomingFlightStateComponent,
    OutgoingFlightStateComponent,
  ],
  templateUrl: './flight-state.component.html',
  styleUrl: './flight-state.component.scss'
})
export class FlightStateComponent {


}
