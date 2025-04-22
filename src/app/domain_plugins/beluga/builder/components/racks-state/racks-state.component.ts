import { AsyncPipe } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, tap } from 'rxjs';
import { RackComponent } from '../../../shared/components/rack/rack.component';
import { selectJigTypes, selectRacksStateList, selectTask, selectTaskState } from '../../state/builder.selector';

@Component({
  selector: 'app-racks-state',
  imports: [
    AsyncPipe,
    RackComponent
  ],
  templateUrl: './racks-state.component.html',
  styleUrl: './racks-state.component.scss'
})
export class RacksStateComponent {

  store = inject(Store);
  
  jigTypes$ = this.store.select(selectJigTypes)
  racks$ = this.store.select(selectRacksStateList);

}
