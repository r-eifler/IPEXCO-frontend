import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { AsyncPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { combineLatest, map, switchMap, take, tap } from 'rxjs';
import { filterNotNullOrUndefined } from 'src/app/shared/common/check_null_undefined';
import { createNewBelugaAction, startDrag, stopDrag } from '../../../builder/state/builder.actions';
import { selectAvailableHangarNames, selectCanDeliver, selectCurrentFlightName, selectCurrentFlightNextOutgoingJigType, selectDeliverableJigs, selectDragInProgress, selectIsDropTargetTrailer, selectMaxPartSize, selectSizeUnit } from '../../../builder/state/builder.selector';
import { BelugaActionType, DeliverToHanger, LoadBeluga, PickUpRack } from '../../domain/beluga_plan';
import { Jig, JigType, Side, Trailer } from '../../domain/beluga_problem';
import { JigComponent } from '../jig/jig.component';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-trailer',
  imports: [
    MatIconModule,
    CdkDropList,
    JigComponent,
    CdkDrag,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
  ],
  templateUrl: './trailer.component.html',
  styleUrl: './trailer.component.scss'
})
export class TrailerComponent {

  store = inject(Store);

  trailer = input.required<Trailer>();
  side = input.required<Side>();
  jig = input.required<Jig>();
  jigType = input.required<JigType>();

  sizeUnit = toSignal(this.store.select(selectSizeUnit));
  maxPartSize = toSignal(this.store.select(selectMaxPartSize));
  displaySize = computed(() => ((this.maxPartSize() ?? 20) * (this.sizeUnit() ?? 10)));

  availableHangars$ = this.store.select(selectAvailableHangarNames);
  deliverableJigs$ = this.store.select(selectDeliverableJigs);

  canDeliver$ = toObservable(this.trailer).pipe(
    filterNotNullOrUndefined(),
    switchMap(t => this.store.select(selectCanDeliver(t.name)))
  );

  currentFlightName$ = this.store.select(selectCurrentFlightName);
  nextOutgoingType = toSignal(this.store.select(selectCurrentFlightNextOutgoingJigType));
  canLoad = computed(() => this.nextOutgoingType() != null && this.nextOutgoingType() == this.jig()?.type);

  dragInProgress$ = this.store.select(selectDragInProgress);
  isDragTarget$ = toObservable(this.trailer).pipe(
    filterNotNullOrUndefined(),
    switchMap(t => this.store.select(selectIsDropTargetTrailer(t.name))),
  );

  empty = () => {
    return this.jig() == null;
  }

  drop(event: CdkDragDrop<Jig[]>){
    if (event.previousContainer === event.container) {
      return;
    }

    let newJig = event.previousContainer.data[event.previousIndex];

    let s =  this.side();

    let action: PickUpRack = {
      name: BelugaActionType.PICK_UP_RACK,
      j: newJig.name,
      t: this.trailer()?.name,
      r: event.previousContainer.id,
      s: s
    };

    console.log(action);

    this.store.dispatch(createNewBelugaAction({action}));
    this.store.dispatch(stopDrag({target: this.trailer()}))
  }

  toHangar(){

    combineLatest([this.availableHangars$, this.deliverableJigs$]).pipe(take(1)).
    subscribe(([availableHangars, deliverableJigs]) => {
      if(availableHangars.length == 0 || deliverableJigs == undefined){
        return;
      }

      let action: DeliverToHanger = {
        name: BelugaActionType.DELIVER_TO_HANGAR,
        j: this.jig().name,
        t: this.trailer()?.name,
        h: availableHangars[0].name,
        pl: deliverableJigs[this.jig().name]
      };
  
      console.log(action);
  
      this.store.dispatch(createNewBelugaAction({action}));
    });
  }


  load(){

    this.currentFlightName$.pipe(take(1)).
    subscribe((flightName) => {
      if(flightName == undefined || flightName == null){
        return;
      }

      let action: LoadBeluga = {
        name: BelugaActionType.LOAD_BELUGA,
        j: this.jig().name,
        b: flightName,
        t: this.trailer()?.name
      };
  
      console.log(action);
  
      this.store.dispatch(createNewBelugaAction({action}));
    });
  }

  onStartDrag(){
    this.store.dispatch(startDrag({source: this.trailer(), jigName: this.jig().name}))
  }

}
