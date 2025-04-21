import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map } from 'rxjs';
import { selectTask, selectTaskState } from '../../state/builder.selector';
import { HangarComponent } from '../../../shared/components/hangar/hangar.component';
import { JigComponent } from '../../../shared/components/jig/jig.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-hangars-state',
  imports: [
    HangarComponent,
    JigComponent,
    AsyncPipe,
  ],
  templateUrl: './hangars-state.component.html',
  styleUrl: './hangars-state.component.scss'
})
export class HangarsStateComponent {


    store = inject(Store);
    
    task$ = this.store.select(selectTask);
    taskState$ = this.store.select(selectTaskState);
    jigTypes$ = this.task$.pipe(map(t => t?.jig_types));
  
    hangars$ = combineLatest([this.task$, this.taskState$]).pipe(
      map(([task,state]) => task?.hangars.map(hn => ({
        name: hn,
        jig: state?.hangars[hn] !== null ? state?.jigs[state?.hangars[hn]] : null
      })))
    );

}
