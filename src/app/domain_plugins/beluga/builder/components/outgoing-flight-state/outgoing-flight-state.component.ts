import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { AsyncPipe } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { JigComponent } from '../../../shared/components/jig/jig.component';
import { BelugaActionType, LoadBeluga } from '../../../shared/domain/beluga_plan';
import { Jig } from '../../../shared/domain/beluga_problem';
import { cancelDrag, createNewBelugaAction, skipIncomingJig, skipOutgoingJigType, stopDrag } from '../../state/builder.actions';
import { selectDraggedJig, selectDragInProgress, selectDragSource, selectFlightSchedule, selectIsDropTargetFlightOutgoing, selectJigTypes, selectOutgoingFlightSchedule, selectOutgoingLoadedJigs, selectRemainingOutgoingJigTypes } from '../../state/builder.selector';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { InfoComponent } from 'src/app/shared/components/info/info/info.component';
import { MatIconModule } from '@angular/material/icon';
import { JigTypeStatusOutgoingComponent } from '../jig-type-status-outgoing/jig-type-status-outgoing.component';
import { selectNextOutgoingJigTypeIndex, selectNextOutgoingJigTypeToLoad, selectOutGoingStatusSchedule } from './outgoing-flight-state.selector';

@Component({
  selector: 'app-outgoing-flight-state',
  imports: [
    MatCardModule,
    TranslocoModule,
    MatButtonModule,
    MatIconModule,
    CdkDropList,
    AsyncPipe,
    InfoComponent,
    JigTypeStatusOutgoingComponent,
  ],
  templateUrl: './outgoing-flight-state.component.html',
  styleUrl: './outgoing-flight-state.component.scss'
})
export class OutgoingFlightStateComponent {

  store = inject(Store);

  nextJigType = this.store.selectSignal(selectNextOutgoingJigTypeToLoad);
  nextJigTypeIndex = this.store.selectSignal(selectNextOutgoingJigTypeIndex);

  outgoingJigsStatusSchedule = this.store.selectSignal(selectOutGoingStatusSchedule);
  
  currentFlight = this.store.selectSignal(selectFlightSchedule);

  dragInProgress$ = this.store.select(selectDragInProgress);
  isDragTarget$ = this.store.select(selectIsDropTargetFlightOutgoing)

  dragSource = this.store.selectSignal(selectDragSource);
  draggedJig = this.store.selectSignal(selectDraggedJig);

  skipPossible = computed(() => this.nextJigType() !== null)
  flightIsEmpty = computed(() => this.outgoingJigsStatusSchedule()?.length == 0)

  constructor(){
    effect(() => console.log(this.outgoingJigsStatusSchedule()))
  }

  dropPossible(){
    return false;
  }

  onSkip(){
    let jigType = this.nextJigType();
    let index = this.nextJigTypeIndex();
    if(jigType !== null && index !== undefined){
      this.store.dispatch(skipOutgoingJigType({jigType, index}))
    }
  }

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
