import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { createNewBelugaAction } from '../../../builder/state/builder.actions';
import { BelugaActionType, DeliverToHanger, PickUpRack } from '../../domain/beluga_plan';
import { Jig, JigType, Side } from '../../domain/beluga_problem';
import { JigComponent } from '../jig/jig.component';
import { MatButtonModule } from '@angular/material/button';
import { selectAvailableHangars, selectDeliverableJigs } from '../../../builder/state/builder.selector';
import { combineLatest, map, take } from 'rxjs';
import { AsyncPipe } from '@angular/common';

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

  name = input.required<string>();
  side = input.required<Side>();
  jig = input.required<Jig>();
  jigType = input.required<JigType>();

  availableHangars$ = this.store.select(selectAvailableHangars);
  deliverableJigs$ = this.store.select(selectDeliverableJigs);

  canDeliver$ = combineLatest([this.availableHangars$, this.deliverableJigs$]).pipe(
    map(([availableHangars, deliverableJigs]) => deliverableJigs !== undefined ? 
    this.jig()?.name in deliverableJigs && availableHangars.length > 0 : false
  ));

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
      t: this.name(),
      r: event.previousContainer.id,
      s: s
    };

    console.log(action);

    this.store.dispatch(createNewBelugaAction({action}));
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
        t: this.name(),
        h: availableHangars[0],
        pl: deliverableJigs[this.jig().name]
      };
  
      console.log(action);
  
      this.store.dispatch(createNewBelugaAction({action}));
    });
  }

}
