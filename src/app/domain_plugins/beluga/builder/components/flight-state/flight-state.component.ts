import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectTask, selectTaskState } from '../../state/builder.selector';
import { IncomingFlightStateComponent } from '../incoming-flight-state/incoming-flight-state.component';
import { OutgoingFlightStateComponent } from '../outgoing-flight-state/outgoing-flight-state.component';
import { combineLatest, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

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
    
    task$ = this.store.select(selectTask);
    taskState$ = this.store.select(selectTaskState)

    jigTypes$ = this.task$.pipe(map(t => t?.jig_types));

    incoming$ = this.taskState$.pipe(
      map(ts => ts?.incoming?.map(jn => ts.jigs[jn]))
    );

    outgoing$ = this.taskState$.pipe(
      map(ts => ts?.outgoing?.map(jn => ts.jigs[jn]))
    );
    jigTypesScheduled$ = combineLatest([this.task$, this.taskState$]).pipe(
      map(([task, state]) => state?.flightIndex != undefined ? 
      task?.flights[state?.flightIndex].outgoing : null)
    )

}
