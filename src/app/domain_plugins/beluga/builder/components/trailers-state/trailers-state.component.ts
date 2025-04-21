import { Component, inject, input } from '@angular/core';
import { Jig, JigType, Side } from '../../../shared/domain/beluga_problem';
import { TrailerComponent } from '../../../shared/components/trailer/trailer.component';
import { JigComponent } from '../../../shared/components/jig/jig.component';
import { Store } from '@ngrx/store';
import { selectTask, selectTaskState } from '../../state/builder.selector';
import { combineLatest, map } from 'rxjs';
import { filterListNotNullOrUndefined } from 'src/app/shared/common/check_null_undefined';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-trailers-state',
  imports: [
    TrailerComponent,
    AsyncPipe,
  ],
  templateUrl: './trailers-state.component.html',
  styleUrl: './trailers-state.component.scss'
})
export class TrailersStateComponent {

  store = inject(Store);

  side = input.required<Side>();

  task$ = this.store.select(selectTask);
  taskState$ = this.store.select(selectTaskState)
  jigTypes$ = this.task$.pipe(map(t => t?.jig_types));

  trailers$ = combineLatest([this.task$, this.taskState$]).pipe(
    filterListNotNullOrUndefined(),
    map(([task, state]) => {
      let jigNames = this.side() == 'bside' ? task.trailers_beluga.map(tn => ({name: tn.name, jig:state?.trailersBeluga[tn.name]})) : 
      task.trailers_factory.map(tn => ({name: tn.name, jig:state?.trailersFactory[tn.name]}))
      return jigNames.map(t => ({name: t.name, jig: t.jig !== null ? state.jigs[t.jig] : null}));
    }),
  );
  
}
