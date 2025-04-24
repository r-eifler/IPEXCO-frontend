import { Component, computed, effect, inject, input } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { JigComponent } from '../../../shared/components/jig/jig.component';
import { Jig, JigType } from '../../../shared/domain/beluga_problem';
import { Store } from '@ngrx/store';
import { selectCurrentFlightSchedule, selectDraggedJig, selectDragInProgress, selectDragSource, selectIsDropTargetFlightOutgoing } from '../../state/builder.selector';
import { AsyncPipe } from '@angular/common';
import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { BelugaActionType, LoadBeluga, UnloadBeluga } from '../../../shared/domain/beluga_plan';
import { cancelDrag, createNewBelugaAction, stopDrag } from '../../state/builder.actions';

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

  jigsLoaded = input.required<Jig[]>();
  jigTypesScheduled = input.required<string[]>();
  jigTypes = input.required<Record<string,JigType>>();

  remaining = computed(() => this.jigTypesScheduled()?.length - this.jigsLoaded().length)

  currentFlight = this.store.selectSignal(selectCurrentFlightSchedule);

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
        this.store.dispatch(stopDrag({target: flight}));  
      }

    }
}
