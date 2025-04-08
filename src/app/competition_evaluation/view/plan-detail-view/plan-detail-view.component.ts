import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { BelugaPlanAnimationComponent } from 'src/app/domain_plugins/beluga/components/beluga-plan-animation/beluga-plan-animation.component';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { EmptyStateModule } from 'src/app/shared/components/empty-state/empty-state.module';
import { PageModule } from 'src/app/shared/components/page/page.module';

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

  // store = inject(Store);

  // plan$ = this.store.select(selectSelectedPlan);
  // project$ = this.store.select(selectProject);
  // domainSpecification$ = this.store.select(selectDomainSpecification);

  // isBeluga$ = this.domainSpecification$.pipe(
  //   map(d => d?.name.includes("Beluga") ?? false)
  // );

}
