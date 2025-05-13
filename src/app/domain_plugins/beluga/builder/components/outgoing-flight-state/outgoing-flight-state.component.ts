import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { AsyncPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { JigComponent } from '../../../shared/components/jig/jig.component';
import { BelugaActionType, LoadBeluga } from '../../../shared/domain/beluga_plan';
import { Jig } from '../../../shared/domain/beluga_problem';
import { cancelDrag, createNewBelugaAction, stopDrag } from '../../state/builder.actions';
import { selectDraggedJig, selectDragInProgress, selectDragSource, selectFlightSchedule, selectIsDropTargetFlightOutgoing, selectJigTypes, selectOutgoingFlightSchedule, selectOutgoingLoadedJigs, selectRemainingOutgoingJigTypes } from '../../state/builder.selector';

@Component({
  selector: 'app-outgoing-flight-state',
  imports: [
    JigComponent,
    TranslocoModule,
    AsyncPipe,
    CdkDropList,
  ],
  templateUrl: './outgoing-flight-state.component.html',
  styleUrl: './outgoing-flight-state.component.scss'
})
export class OutgoingFlightStateComponent {

  store = inject(Store);

  jigTypes = this.store.selectSignal(selectJigTypes);
  
  schedule = this.store.selectSignal(selectOutgoingFlightSchedule);
  loaded = this.store.selectSignal(selectOutgoingLoadedJigs);

  remainingJigTypes = this.store.selectSignal(selectRemainingOutgoingJigTypes);

  numRemaining = computed(() => this.remainingJigTypes()?.length ?? 0)

  currentFlight = this.store.selectSignal(selectFlightSchedule);

  dragInProgress$ = this.store.select(selectDragInProgress);
  isDragTarget$ = this.store.select(selectIsDropTargetFlightOutgoing)

  dragSource = this.store.selectSignal(selectDragSource);
  draggedJig = this.store.selectSignal(selectDraggedJig);

  drop(event: CdkDragDrop<Jig[]>){
      if (event.previousContainer === event.container) {
        this.store.dispatch(cancelDrag());
        return;
      }
  
      let newJig = this.draggedJig();
      let source = this.dragSource();
      let flight = this.currentFlight();
  
      if(newJig === null || source === null|| flight === undefined || flight === null){
        return;
      }
    
      if(source?.stageType == 'trailer'){
  
        let action: LoadBeluga = {
          name: BelugaActionType.LOAD_BELUGA,
          j: newJig,
          b: flight.name,
          t: source.name
        };
  
        this.store.dispatch(createNewBelugaAction({action}));
        this.store.dispatch(stopDrag({target: {...flight, stageType: "flight"}}));  
      }

    }
}
