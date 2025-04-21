import { Component, inject, input } from '@angular/core';
import { Jig, JigType } from '../../../shared/domain/beluga_problem';
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
    JigComponent,
    AsyncPipe,
  ],
  templateUrl: './trailers-state.component.html',
  styleUrl: './trailers-state.component.scss'
})
export class TrailersStateComponent {

  store = inject(Store);

  belugaSide = input.required<boolean>();

  task$ = this.store.select(selectTask);
  taskState$ = this.store.select(selectTaskState)
  jigTypes$ = this.task$.pipe(map(t => t?.jig_types));

  jigs$ = combineLatest([this.task$, this.taskState$]).pipe(
    filterListNotNullOrUndefined(),
    map(([task, state]) => {
      let jigNames = this.belugaSide() ? task.trailers_beluga.map(tn => state?.trailersBeluga[tn.name]) : 
        task.trailers_factory.map(tn => state?.trailersFactory[tn.name])
      return jigNames.map(jn => jn !== null ? state.jigs[jn] : null) ?? [];
    }),
  );
  
}
