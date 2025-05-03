import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectHangarsStateList, selectJigTypes } from '../../state/builder.selector';
import { HangarWrapperComponent } from '../hangar-wrapper/hangar-wrapper.component';

@Component({
  selector: 'app-hangars-state',
  imports: [
    HangarWrapperComponent,
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
