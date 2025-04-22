import { AsyncPipe } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { TrailerComponent } from '../../../shared/components/trailer/trailer.component';
import { Side, Trailer } from '../../../shared/domain/beluga_problem';
import { selectJigTypes, selectTrailersStateList } from '../../state/builder.selector';
import { Observable, switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { filterNotNullOrUndefined } from 'src/app/shared/common/check_null_undefined';

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

  jigTypes$ = this.store.select(selectJigTypes);

  trailerStates$ = toObservable(this.side).pipe(
    filterNotNullOrUndefined(),
    switchMap(s => this.store.select(selectTrailersStateList(s))),
  );

}
