import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ActionCardModule } from 'src/app/shared/components/action-card/action-card.module';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { PlanCardComponent } from '../../components/plan-card/plan-card.component';
import { selectPlans, selectProject, selectSupportedPlanners } from '../../state/planning.selector';
import { PlanCreatorComponent } from '../plan-creator/plan-creator.component';
import { combineLatest, map, take, tap } from 'rxjs';
import { cancelPlanComputation, loadServices, registerPlanComputation } from '../../state/planning.actions';
import { PlanBase } from '../../domain/plan';
import { MatDialog } from '@angular/material/dialog';
import { Service } from 'src/app/global_specification/domain/services';

@Component({
  selector: 'app-plans-list-view',
  imports: [
    PageModule,
    AsyncPipe,
    ActionCardModule,
    MatIconModule,
    RouterLink,
    BreadcrumbModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    PlanCardComponent
  ],
  templateUrl: './plans-list-view.component.html',
  styleUrl: './plans-list-view.component.scss'
})
export class PlansListViewComponent {

  store = inject(Store);
  dialog = inject(MatDialog);

  project$ = this.store.select(selectProject);
  plans$ = this.store.select(selectPlans);
  planners$ = this.store.select(selectSupportedPlanners);

  plannersMap$ = this.planners$.pipe(
    map(list => list.reduce((acc, cv) => ({...acc,[cv._id]: cv}), {} as Record<string, Service>))
  );

  constructor() {
    this.store.dispatch(loadServices());
  }

  onNewPlannerCall() {
      combineLatest([this.project$, this.planners$]).pipe(take(1))
      .subscribe(([project,planners]) => {
        let dialogRef = this.dialog.open(PlanCreatorComponent, {data: {planners}});
        dialogRef.afterClosed().pipe(take(1)).subscribe((plan: PlanBase) =>{
          if(plan && project?._id !== undefined){
            plan.project = project?._id;
            this.store.dispatch(registerPlanComputation({plan: plan}))
          }
        });
      })
  }

  onCancel(id: string) {
    this.store.dispatch(cancelPlanComputation({id}));
  }

}
