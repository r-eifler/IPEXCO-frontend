import { Component, computed, effect, inject, input } from '@angular/core';
import { Jig, JigType } from '../../../shared/domain/beluga_problem';
import { JigComponent } from '../../../shared/components/jig/jig.component';
import { TranslocoModule } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { BelugaActionType, UnloadBeluga } from '../../../shared/domain/beluga_plan';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectAvailableBelugaTrailers, selectCurrentFlightSchedule } from '../../state/builder.selector';
import { createNewBelugaAction } from '../../state/builder.actions';

@Component({
  selector: 'app-incoming-flight-state',
  imports: [
    JigComponent,
    TranslocoModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './incoming-flight-state.component.html',
  styleUrl: './incoming-flight-state.component.scss'
})
export class IncomingFlightStateComponent {

  store = inject(Store);

  jigs = input.required<Jig[]>();
  jigTypes = input.required<Record<string,JigType>>();

  remainingNumJigs = computed(() => this.jigs()?.length ?? '?')

  availableTrailers = toSignal(this.store.select(selectAvailableBelugaTrailers));
  currentFlight = toSignal(this.store.select(selectCurrentFlightSchedule));

  unloadAvailable = computed(() => this.currentFlight() != null && 
    (this.availableTrailers()?.length ?? 0) > 0 && 
    this.jigs()?.length > 0
  );

  onUnload(){
    let flightName = this.currentFlight()?.name;
    let nextTrailer = this.availableTrailers()?.[0]?.name;

    if(flightName != null && nextTrailer !== undefined){
      let unloadAction: UnloadBeluga = {
        name: BelugaActionType.UNLOAD_BELUGA,
        j: this.jigs()?.[0].name,
        b: flightName,
        t: nextTrailer
      }

      this.store.dispatch(createNewBelugaAction({action: unloadAction}));
    }
  }
}
