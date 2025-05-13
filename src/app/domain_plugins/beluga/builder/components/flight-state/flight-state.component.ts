import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectJigTypes, selectOutgoingFlightSchedule, selectOutgoingLoaded } from '../../state/builder.selector';
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

    store = inject(Store);
    
    jigTypes$ = this.store.select(selectJigTypes);

    outgoing$ = this.store.select(selectOutgoingFlightSchedule);
    outgoingLoaded$ = this.store.select(selectOutgoingLoaded);

}
