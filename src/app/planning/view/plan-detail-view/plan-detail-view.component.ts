import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { BelugaPlanAnimationComponent } from 'src/app/domain_plugins/beluga/shared/components/beluga-plan-animation/beluga-plan-animation.component';
import { BelugaDirective } from 'src/app/domain_plugins/beluga/shared/directives/isBeluga.directive';
import { PlanViewComponent } from 'src/app/iterative_planning/components/plan/plan-view/plan-view.component';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { EmptyStateModule } from 'src/app/shared/components/empty-state/empty-state.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { selectDomainSpecification, selectProject, selectSelectedPlan } from '../../state/planning.selector';
import { map } from 'rxjs';
import { PlanInspectionComponent } from 'src/app/domain_plugins/beluga/shared/components/plan-inspection/plan-inspection.component';

@Component({
  selector: 'app-plan-detail-view',
  imports: [
    AsyncPipe,
    BreadcrumbModule,
    EmptyStateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    PageModule,
    RouterLink,
    BelugaPlanAnimationComponent,
  ],
  templateUrl: './plan-detail-view.component.html',
  styleUrl: './plan-detail-view.component.scss'
})
export class PlanDetailViewComponent {

  store = inject(Store);

  plan$ = this.store.select(selectSelectedPlan);
  project$ = this.store.select(selectProject);
  domainSpecification$ = this.store.select(selectDomainSpecification);

  model$ = this.project$.pipe(
    map(p => p?.baseTask?.model)
  );

  isBeluga$ = this.domainSpecification$.pipe(
    map(d => d?.name.includes("Beluga") ?? false)
  );

}
