import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, tap } from 'rxjs';
import { RackComponent } from '../../../shared/components/rack/rack.component';
import { selectTask, selectTaskState } from '../../state/builder.selector';

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
  
  task$ = this.store.select(selectTask);
  taskState$ = this.store.select(selectTaskState)

  racks$ = combineLatest([this.task$, this.taskState$]).pipe(
    map(([task, state]) => task?.racks.map(r => ({
      ...r,
      jigs: state?.racks[r.name].map(jn => state.jigs[jn]) ?? []
    }))),
  );

  jigTypes$ = this.task$.pipe(map(t => t?.jig_types));

}
