import { Component, computed, inject, input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { sum } from 'ramda';
import {CdkDrag, CdkDragDrop, CdkDragStart, CdkDropList} from '@angular/cdk/drag-drop';
import { Store } from '@ngrx/store';
import { cancelDrag, createNewBelugaAction, startDrag, stopDrag } from '../../state/builder.actions';
import { DragSource } from '../../state/builder.reducer';
import { selectDraggedJig, selectDraggedSides, selectDragInProgress, selectDragSource, selectIsDropTargetRack } from '../../state/builder.selector';
import { AsyncPipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { filterNotNullOrUndefined } from 'src/app/shared/common/check_null_undefined';
import { switchMap } from 'rxjs';
import { JigComponent } from '../../../shared/components/jig/jig.component';
import { getJigSize, Jig, JigType, Side } from '../../../shared/domain/beluga_problem';
import { BelugaActionType, PutDownRack } from '../../../shared/domain/beluga_plan';
import { RackComponent } from '../../../shared/components/rack/rack.component';
import { DropTargetComponent } from '../drop-target/drop-target.component';

@Component({
  selector: 'app-rack-wrapper',
  imports: [
    MatTooltipModule,
    JigComponent,
    CdkDrag,
    CdkDropList,
    AsyncPipe,
    RackComponent,
    DropTargetComponent
],
  templateUrl: './rack-wrapper.component.html',
  styleUrl: './rack-wrapper.component.scss'
})
export class RackWrapperComponent {

  store = inject(Store);

  rack = input.required<{name: string, size: number, jigs: Jig[]}>();
  jigTypes = input.required<Record<string,JigType>>();

  name = computed(() => this.rack()?.name.replace('rack',''))
  occupied = computed(() => sum(this.rack().jigs.map(j => 
    j.empty ? this.jigTypes()?.[j.type].size_empty : this.jigTypes()?.[j.type]?.size_loaded))
  )

  tooltip = computed(() => 'size: ' + this.rack().size);

  fits = (item: CdkDrag<Jig>) => {
    let jig = item.data;
    if(jig == undefined){
      return false;
    }

    return this.rack()?.size - this.occupied() >= getJigSize(jig, this.jigTypes()?.[jig?.type]);
  }

  dragInProgress$ = this.store.select(selectDragInProgress);
  isDragTarget$ = toObservable(this.rack).pipe(
    filterNotNullOrUndefined(),
    switchMap(r => this.store.select(selectIsDropTargetRack(r.name))),
  );

  dragSource = this.store.selectSignal(selectDragSource);
  draggedJig = this.store.selectSignal(selectDraggedJig);
  draggedSides = this.store.selectSignal(selectDraggedSides);

  drop(event: CdkDragDrop<Jig[]>){
    console.log("Drop Rack")
    if (event.previousContainer === event.container) {
      this.store.dispatch(cancelDrag());
      return;
    }

    let newJig = this.draggedJig();
    let source = this.dragSource()
    let sides =  this.draggedSides();

    if(source?.stageType == 'trailer' && sides?.length == 1 && newJig != null){
      let action: PutDownRack = {
        name: BelugaActionType.PUT_DOWN_RACK,
        j: newJig,
        t: source.name,
        r: this.rack()?.name,
        s: sides[0]
      };
  
      console.log(action);
  
      this.store.dispatch(createNewBelugaAction({action}));
      this.store.dispatch(stopDrag({target: {...this.rack(), stageType: 'rack'}}))
    }
  }

  onStartDrag(jig: Jig, sides: Side[]){
    this.store.dispatch(startDrag({source: {...this.rack(), stageType: 'rack'}, jigName: jig.name, sides}))
  }

  onCancelDrag(event: CdkDragDrop<Jig>){
    if(!event.isPointerOverContainer){
      this.store.dispatch(cancelDrag());
    }  
  }

  getSides(index: number){
    if(this.rack().jigs.length <= 1){
      return ['bside', 'fside'] as Side[];
    }
    if(index === 0){
      return ['bside'] as Side[];
    }
    else{
      return ['fside'] as Side[];
    }
  }
}
