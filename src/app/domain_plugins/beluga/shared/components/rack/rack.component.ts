import { Component, computed, inject, input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Jig, JigType, Rack } from '../../domain/beluga_problem';
import { JigComponent } from '../jig/jig.component';
import { sum } from 'ramda';
import {CdkDrag, CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop';
import { BelugaActionType, PutDownRack } from '../../domain/beluga_plan';
import { Store } from '@ngrx/store';
import { createNewBelugaAction } from '../../../builder/state/builder.actions';

@Component({
  selector: 'app-rack',
  imports: [
    MatTooltipModule,
    JigComponent,
    CdkDrag,
    CdkDropList,
  ],
  templateUrl: './rack.component.html',
  styleUrl: './rack.component.scss'
})
export class RackComponent {

  store = inject(Store);

  rack = input.required<{name: string, size: number, jigs: Jig[]}>();
  jigTypes = input.required<Record<string,JigType>>();

  name = computed(() => this.rack()?.name.replace('rack',''))
  occupied = computed(() => sum(this.rack().jigs.map(j => 
    j.empty ? this.jigTypes()?.[j.type].size_empty : this.jigTypes()?.[j.type].size_loaded))
  )

  tooltip = computed(() => 'size: ' + this.rack().size);

  drop(event: CdkDragDrop<Jig[]>){
    if (event.previousContainer === event.container) {
      return;
    }

    console.log(event);

    let newJig = event.previousContainer.data[event.previousIndex];

    let action: PutDownRack = {
      name: BelugaActionType.PUT_DOWN_RACK,
      j: newJig.name,
      t: event.previousContainer.id,
      r: this.rack()?.name,
      s: event.distance.x >= 0 ? 'bside' : 'fside'
    };

    console.log(action);

    this.store.dispatch(createNewBelugaAction({action}));
  }
}
