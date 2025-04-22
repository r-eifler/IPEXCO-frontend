import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { HangarComponent } from '../../../shared/components/hangar/hangar.component';
import { selectHangarsStateList, selectJigTypes } from '../../state/builder.selector';

@Component({
  selector: 'app-hangars-state',
  imports: [
    HangarComponent,
    AsyncPipe,
  ],
  templateUrl: './hangars-state.component.html',
  styleUrl: './hangars-state.component.scss'
})
export class HangarsStateComponent {


    store = inject(Store);
    
    jigTypes$ = this.store.select(selectJigTypes);
    hangars$ = this.store.select(selectHangarsStateList);

}
