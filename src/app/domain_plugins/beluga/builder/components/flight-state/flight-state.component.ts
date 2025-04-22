import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentOutgoingFlightSchedule, selectIncomingFlightStateJigs, selectJigTypes, selectOutgoingFlightStateJigs } from '../../state/builder.selector';
import { IncomingFlightStateComponent } from '../incoming-flight-state/incoming-flight-state.component';
import { OutgoingFlightStateComponent } from '../outgoing-flight-state/outgoing-flight-state.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-flight-state',
  imports: [
    IncomingFlightStateComponent,
    OutgoingFlightStateComponent,
    AsyncPipe,
  ],
  templateUrl: './flight-state.component.html',
  styleUrl: './flight-state.component.scss'
})
export class FlightStateComponent {

    store = inject(Store);
    
    jigTypes$ = this.store.select(selectJigTypes);

    incoming$ = this.store.select(selectIncomingFlightStateJigs);
    outgoing$ = this.store.select(selectOutgoingFlightStateJigs);

    jigTypesScheduled$ = this.store.select(selectCurrentOutgoingFlightSchedule);

}
