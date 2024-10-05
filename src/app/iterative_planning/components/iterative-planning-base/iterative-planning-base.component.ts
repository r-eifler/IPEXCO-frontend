import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { loadProject } from '../../state/iterative-planning.actions';

@Component({
  selector: 'app-iterative-planning-base',
  templateUrl: './iterative-planning-base.component.html',
  styleUrl: './iterative-planning-base.component.scss'
})

export class IterativePlanningBaseComponent {

  constructor(
    store: Store,
    private route: ActivatedRoute,
  ) {

    this.route.paramMap
      .pipe(
        tap((params) => console.log(params.get("projectid"))),
        tap((params: ParamMap) => store.dispatch(loadProject({id: params.get("projectid")}))),
        takeUntilDestroyed()
      ).subscribe();
  }

}
