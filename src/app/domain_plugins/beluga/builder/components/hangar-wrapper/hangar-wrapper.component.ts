import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs';
import { filterNotNullOrUndefined } from 'src/app/shared/common/check_null_undefined';
import { HangarComponent } from '../../../shared/components/hangar/hangar.component';
import { cancelDrag, createNewBelugaAction, startDrag, stopDrag } from '../../state/builder.actions';
import { selectAvailableFactoryTrailers, selectDeliverableJigs, selectDraggedJig, selectDragInProgress, selectDragSource, selectIsDropTargetHangar, selectMaxPartSize, selectSizeUnit } from '../../state/builder.selector';
import { Jig, JigType } from '../../../shared/domain/beluga_problem';
import { BelugaActionType, DeliverToHanger, GetFromHanger } from '../../../shared/domain/beluga_plan';
import { JigComponent } from '../../../shared/components/jig/jig.component';
import { DropTargetComponent } from '../drop-target/drop-target.component';


@Component({
  selector: 'app-hangar-wrapper',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatIconModule,
    JigComponent,
    CdkDropList,
    CdkDrag,
    AsyncPipe,
    HangarComponent,
    NgIf,
    DropTargetComponent,
  ],
  templateUrl: './hangar-wrapper.component.html',
  styleUrl: './hangar-wrapper.component.scss'
})
export class HangarWrapperComponent {

    store = inject(Store);

    name = input.required<string>();
    jig = input.required<Jig>();
    jigType = input.required<JigType>();

    sizeUnit = toSignal(this.store.select(selectSizeUnit));
    maxPartSize = toSignal(this.store.select(selectMaxPartSize));
    displaySize = computed(() => ((this.maxPartSize() ?? 20) * (this.sizeUnit() ?? 10)));

    availableTrailers = toSignal(this.store.select(selectAvailableFactoryTrailers));

    trailerAvailable = computed(() => (this.availableTrailers()?.length ?? 0) > 0 && this.jig() != null)

    empty = () => {
      return this.jig() == null;
    }

    dragInProgress$ = this.store.select(selectDragInProgress);
    isDragTarget$ = toObservable(this.name).pipe(
      filterNotNullOrUndefined(),
      switchMap((hn) => this.store.select(selectIsDropTargetHangar(hn))),
    );

    fromHangar(){
      let nextTrailer = this.availableTrailers()?.[0]?.name;

      if(nextTrailer != undefined){

        let action: GetFromHanger = {
          name: BelugaActionType.GET_FROM_HANGAR,
          j: this.jig()?.name,
          h: this.name(),
          t: nextTrailer
        };
    
        console.log(action);
    
        this.store.dispatch(createNewBelugaAction({action}));
      }
    }

    dragSource = this.store.selectSignal(selectDragSource);
    draggedJig = this.store.selectSignal(selectDraggedJig);
    deliverableJigs = this.store.selectSignal(selectDeliverableJigs);

    drop(event: CdkDragDrop<Jig[]>){
      if (event.previousContainer === event.container) {
        this.store.dispatch(cancelDrag());
        return;
      }
  
      let newJig = this.draggedJig();
      let source = this.dragSource();
      
  
      if(newJig === null || source === null){
        return;
      }

      let productionLine = this.deliverableJigs()?.[newJig];

      if(productionLine === null || productionLine === undefined){
        return;
      }
    
      if(source?.stageType == 'trailer'){
  
        let action: DeliverToHanger = {
          name: BelugaActionType.DELIVER_TO_HANGAR,
          j: newJig,
          t: source.name,
          h: this.name(),
          pl: productionLine
        }
  
  
        this.store.dispatch(createNewBelugaAction({action}));
        this.store.dispatch(stopDrag({target: {name: this.name(), stageType: 'hangar'}}))
      }
    }

    onStartDrag(){
      this.store.dispatch(startDrag({source: {name: this.name(), stageType: 'hangar'}, jigName: this.jig().name, sides: ['fside']}))
    }
  
    onCancelDrag(event: CdkDragDrop<Jig>){
      if(!event.isPointerOverContainer){
        this.store.dispatch(cancelDrag())
      }  
    }

}
