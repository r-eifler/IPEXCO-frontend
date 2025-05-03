import { AsyncPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs';
import { filterNotNullOrUndefined } from 'src/app/shared/common/check_null_undefined';
import { Side } from '../../../shared/domain/beluga_problem';
import { selectJigTypes, selectTrailersStateList } from '../../state/builder.selector';
import { TrailerWrapperComponent } from '../trailer-wrapper/trailer-wrapper.component';

@Component({
  selector: 'app-trailers-state',
  imports: [
    TrailerWrapperComponent,
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
