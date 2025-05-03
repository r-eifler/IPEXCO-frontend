import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { RackComponent } from '../../../shared/components/rack/rack.component';
import { selectJigTypes, selectRacksStateList } from '../../state/builder.selector';
import { RackWrapperComponent } from '../rack-wrapper/rack-wrapper.component';

@Component({
  selector: 'app-racks-state',
  imports: [
    AsyncPipe,
    RackWrapperComponent
  ],
  templateUrl: './racks-state.component.html',
  styleUrl: './racks-state.component.scss'
})
export class RacksStateComponent {

  store = inject(Store);
  
  jigTypes$ = this.store.select(selectJigTypes)
  racks$ = this.store.select(selectRacksStateList);

}
