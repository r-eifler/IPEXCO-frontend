import { Routes } from '@angular/router';
import { ShellComponent } from './view/shell/shell.component';
import { PlansListViewComponent } from './view/plans-list-view/plans-list-view.component';
import { PlanDetailViewComponent } from './view/plan-detail-view/plan-detail-view.component';
import { setPlanResolver } from './resolver/set-plan.resolver';
import { PlanningProjectService } from './service/project.service';
import { planningFeatureEffects } from './state/effects/effects';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { planningFeature } from './state/planning.feature';
import { loadProjectResolver } from './resolver/load-project.resolver';
import { PlanningPlansService } from './service/plans.service';
import { DomainSpecificationService } from './service/domainSpecification.service';
import { ServicesService } from './service/services.service';
import { PlanComputationMonitoringService } from './service/plan-computataion-monitoring.service';
import { setComparePlansResolver } from './resolver/set-plans-compare.resolver';
import { PlanComparisonComponent } from '../domain_plugins/beluga/shared/view/plan-comparison/plan-comparison.component';


export const routes: Routes = [
  {
    path: ':projectId',
    component: ShellComponent,
    resolve: { loadProjectResolver },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    providers: [
      provideState(planningFeature),
      provideEffects(planningFeatureEffects),
      PlanningProjectService,
      PlanningPlansService,
      DomainSpecificationService,
      ServicesService,
      PlanComputationMonitoringService
    ],
    children: [
      { path: '', redirectTo: 'plans', pathMatch: 'full' },
      {
        path: 'plans',
        component: PlansListViewComponent,
      },
      {
        path: 'plans/:planId',
        component: PlanDetailViewComponent,
        resolve: { setPlanResolver },
      },
      {
        path: 'plans/:planId/compare/:planIdComp',
        component: PlanComparisonComponent,
        resolve: { setComparePlansResolver },
      },
    ]
  }
];