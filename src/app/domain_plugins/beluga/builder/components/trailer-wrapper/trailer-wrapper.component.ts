import { CdkDrag, CdkDragDrop, CdkDragEnd, CdkDropList } from '@angular/cdk/drag-drop';
import { AsyncPipe, NgIf } from '@angular/common';
import { ApplicationRef, Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { combineLatest, map, switchMap, take, tap } from 'rxjs';
import { filterListNotNullOrUndefined, filterNotNullOrUndefined } from 'src/app/shared/common/check_null_undefined';
import { cancelDrag, createNewBelugaAction, startDrag, stopDrag } from '../../state/builder.actions';
import { selectAvailableHangarNames, selectCanDeliver, selectFlightName, selectCurrentFlightNextOutgoingJigType, selectDeliverableJigs, selectDraggedJig, selectDragInProgress, selectDragSource, selectIsDropTargetTrailer, selectMaxPartSize, selectSizeUnit } from '../../state/builder.selector';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { JigComponent } from '../../../shared/components/jig/jig.component';
import { Jig, JigType, Side, Trailer } from '../../../shared/domain/beluga_problem';
import { BelugaAction, BelugaActionType, DeliverToHanger, GetFromHanger, LoadBeluga, PickUpRack, UnloadBeluga } from '../../../shared/domain/beluga_plan';
import { TrailerComponent } from '../../../shared/components/trailer/trailer.component';
import { DropTargetComponent } from '../drop-target/drop-target.component';

@Component({
  selector: 'app-trailer-wrapper',
  imports: [
    MatIconModule,
    CdkDropList,
    JigComponent,
    CdkDrag,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    TrailerComponent,
    NgIf,
    DropTargetComponent,
  ],
  templateUrl: './trailer-wrapper.component.html',
  styleUrl: './trailer-wrapper.component.scss'
})
export class TrailerWrapperComponent {
  appRef = inject(ApplicationRef);
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

  currentFlightName$ = this.store.select(selectFlightName);
  nextOutgoingType = toSignal(this.store.select(selectCurrentFlightNextOutgoingJigType));
  canLoad = computed(() => this.nextOutgoingType() != null && this.nextOutgoingType() == this.jig()?.type);

  dragInProgress$ = this.store.select(selectDragInProgress);
  isDragTarget$ = combineLatest([toObservable(this.side), toObservable(this.trailer)]).pipe(
    filterListNotNullOrUndefined(),
    switchMap(([s,t]) => this.store.select(selectIsDropTargetTrailer(t.name, s))),
  );

  dragSource = this.store.selectSignal(selectDragSource);
  draggedJig = this.store.selectSignal(selectDraggedJig);

  empty = () => {
    return this.jig() == null;
  }

  drop(event: CdkDragDrop<Jig[]>){
    if (event.previousContainer === event.container) {
      this.store.dispatch(cancelDrag());
      return;
    }

    let newJig = this.draggedJig();
    let source = this.dragSource()
    let s =  this.side();

    if(newJig === null || source === null){
      return;
    }

    let action: BelugaAction | undefined = undefined;

    if(source?.stageType == 'flight'){

      action = {
        name: BelugaActionType.UNLOAD_BELUGA,
        j: newJig,
        b: source.name,
        t: this.trailer().name
      } as UnloadBeluga;

    }


    if(source?.stageType == 'rack'){

      action = {
        name: BelugaActionType.PICK_UP_RACK,
        j: newJig,
        t: this.trailer().name,
        r: source.name,
        s: s
      } as PickUpRack;
    }


    if(source?.stageType == 'hangar'){

      action = {
        name: BelugaActionType.GET_FROM_HANGAR,
        j: newJig,
        t: this.trailer().name,
        h: source.name,
      } as GetFromHanger;
    }

    if(action !== undefined){
      console.log(action);

      this.store.dispatch(createNewBelugaAction({action}));
      this.store.dispatch(stopDrag({target: {...this.trailer(), stageType: 'trailer'}}))
    }
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

      document.startViewTransition(() => {
        this.store.dispatch(createNewBelugaAction({action}));
        this.appRef.tick();
      });
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


      document.startViewTransition(() => {
        this.store.dispatch(createNewBelugaAction({action}));
        this.appRef.tick();
      });
    });
  }

  onStartDrag(){
    console.log(this.trailer)
    this.store.dispatch(startDrag({source: {...this.trailer(), stageType: 'trailer'}, jigName: this.jig().name, sides: [this.side()]}))
  }

  onCancelDrag(event: CdkDragDrop<Jig>){
    if(!event.isPointerOverContainer){
      this.store.dispatch(cancelDrag())
    }
  }

}
