import { AsyncPipe } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { BelugaPlanAnimationComponent } from 'src/app/domain_plugins/beluga/components/beluga-plan-animation/beluga-plan-animation.component';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { EmptyStateModule } from 'src/app/shared/components/empty-state/empty-state.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { selectSelectedInstance } from '../../state/competition_evaluation.selector';
import { Store } from '@ngrx/store';
import { MarkedPipe } from 'src/app/pipes/marked.pipe';
import { StepControlComponent } from 'src/app/domain_plugins/beluga/components/step-control/step-control.component';
import { PlanInspectionComponent } from 'src/app/domain_plugins/beluga/components/plan-inspection/plan-inspection.component';
import { BehaviorSubject, combineLatest, map, startWith, take, tap } from 'rxjs';
import { array } from 'zod';
import { BelugaActionZ } from 'src/app/domain_plugins/beluga/domain/beluga_plan';
import { BelugaProblemZ } from 'src/app/domain_plugins/beluga/domain/beluga_problem';
import { filterNotNullOrUndefined } from 'src/app/shared/common/check_null_undefined';
import { applyActions, getInitialState } from 'src/app/domain_plugins/beluga/domain/beluga_state';
import { StateCardComponent } from 'src/app/domain_plugins/beluga/components/state-card/state-card.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-plan-detail-view',
  imports: [
    MarkedPipe,
    AsyncPipe,
    BreadcrumbModule,
    EmptyStateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    PageModule,
    RouterLink,
    BelugaPlanAnimationComponent,
    StepControlComponent,
    PlanInspectionComponent,
    StateCardComponent
  ],
  templateUrl: './plan-detail-view.component.html',
  styleUrl: './plan-detail-view.component.scss'
})
export class PlanDetailViewComponent {

  store = inject(Store);

  instance$ = this.store.select(selectSelectedInstance);

  actions$ = this.instance$.pipe(
    filterNotNullOrUndefined(),
    map(instance => instance?.actions != null &&  instance?.actions != undefined ? 
      array(BelugaActionZ).parse(instance?.actions) ?? [] : [])
  );

  constructor(){
    this.actions$.pipe(takeUntilDestroyed()).subscribe(console.log);
  }

  model$ = this.instance$.pipe(
    filterNotNullOrUndefined(),
    map(instance => BelugaProblemZ.parse(instance?.model)),
  );

  initialState$ = this.model$.pipe(
    map(model => model === null ? null : getInitialState(model))
  )

  selectedActionIndex$ = new BehaviorSubject<number|null>(null);

  selectedState$ = combineLatest([this.initialState$, this.actions$, this.selectedActionIndex$, this.model$]).pipe(
      map(([init, refActions, index, model]) => {
  
        if(init === null || refActions === null || index === null || model == null){
          return;
        }
        const actions = refActions?.slice(0,index+1)
        return applyActions(init, actions, model);
      })
  );

  onActionSelected(index: number){
    this.selectedActionIndex$.next(index);
  }

  onForward(){
      this.actions$.pipe(
        take(1)
      ).subscribe((actions) => 
        this.selectedActionIndex$.next( this.selectedActionIndex$.value === null ? 
        0 : Math.min(this.selectedActionIndex$.value + 1, actions?.length ?? 0))
      )
    }
  
  onBack(){
    this.selectedActionIndex$.next( this.selectedActionIndex$.value === null ? 
        0 : Math.max(this.selectedActionIndex$.value - 1, -1))
  }

}
