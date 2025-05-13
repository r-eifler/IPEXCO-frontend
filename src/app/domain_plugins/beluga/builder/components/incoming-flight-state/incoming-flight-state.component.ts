import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { AsyncPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { JigComponent } from '../../../shared/components/jig/jig.component';
import { BelugaActionType, UnloadBeluga } from '../../../shared/domain/beluga_plan';
import { Jig, JigType } from '../../../shared/domain/beluga_problem';
import { cancelDrag, createNewBelugaAction, startDrag } from '../../state/builder.actions';
import { selectAvailableBelugaTrailers, selectDragInProgress, selectFlightSchedule, selectIncomingFlightSchedule, selectIncomingUnloaded, selectJigTypes, selectRemainingIncomingJigs } from '../../state/builder.selector';

@Component({
  selector: 'app-incoming-flight-state',
  imports: [
    JigComponent,
    TranslocoModule,
    MatButtonModule,
    MatIconModule,
	CdkDropList,
	CdkDrag,
	AsyncPipe,
  ],
  templateUrl: './incoming-flight-state.component.html',
  styleUrl: './incoming-flight-state.component.scss'
})
export class IncomingFlightStateComponent {

  store = inject(Store);

  jigTypes = this.store.selectSignal(selectJigTypes);

  schedule = this.store.selectSignal(selectIncomingFlightSchedule);
  loaded = this.store.selectSignal(selectIncomingUnloaded);

  remainingJigs = this.store.selectSignal(selectRemainingIncomingJigs);

  availableTrailers = this.store.selectSignal(selectAvailableBelugaTrailers);
  currentFlight = this.store.selectSignal(selectFlightSchedule);
  dragInProgress$ = this.store.select(selectDragInProgress);

  remainingNumJigs = computed(() => this.remainingJigs()?.length ?? '?')

  unloadAvailable = computed(() => this.currentFlight() != null && 
    (this.availableTrailers()?.length ?? 0) > 0 && 
    (this.remainingJigs()?.length ?? 0) > 0
  );

  onUnload(){
    let flightName = this.currentFlight()?.name;
    let nextTrailer = this.availableTrailers()?.[0]?.name;
    let jigName = this.remainingJigs()?.[0].name;

    if(flightName != null && nextTrailer !== undefined && jigName !== undefined){
      let unloadAction: UnloadBeluga = {
        name: BelugaActionType.UNLOAD_BELUGA,
        j: jigName,
        b: flightName,
        t: nextTrailer
      }

      this.store.dispatch(createNewBelugaAction({action: unloadAction}));
    }
  }

  
  drop(event: CdkDragDrop<Jig[]>){
      if (event.previousContainer === event.container) {
        this.store.dispatch(cancelDrag());
      }
    }

  noDrop(){
    return false;
  }

  onStartDrag(jig: Jig){
    let flight = this.currentFlight();
    if(flight !== undefined && flight !== null){
    	this.store.dispatch(startDrag({source: {...flight, stageType: "flight"}, jigName: jig.name, sides: ['bside']}))
    }
      
  }

  onCancelDrag(event: CdkDragDrop<Jig>){
    if(!event.isPointerOverContainer){
      this.store.dispatch(cancelDrag())
    }  
  }
}
