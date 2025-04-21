import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { createNewBelugaAction } from '../../../builder/state/builder.actions';
import { BelugaActionType, PickUpRack } from '../../domain/beluga_plan';
import { Jig, JigType, Side } from '../../domain/beluga_problem';
import { JigComponent } from '../jig/jig.component';

@Component({
  selector: 'app-trailer',
  imports: [
    MatIconModule,
    CdkDropList,
    JigComponent,
    CdkDrag,
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

}
