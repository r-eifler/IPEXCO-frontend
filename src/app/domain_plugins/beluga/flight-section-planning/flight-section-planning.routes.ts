import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { BuilderProjectService } from '../builder/services/project.service';
import { BuilderFeature } from '../builder/state/builder.feature';
import { builderEffects } from '../builder/state/effects/effects';
import { LoadProjectResolver } from './resolver/load-project.resolver';
import { DomainSpecificationService } from './services/domainSpecification.service';
import { FlightPlanTreeService } from './services/flight-plan-tree.service';
import { ProjectService } from './services/project.service';
import { ServicesService } from './services/services.service';
import { flightSectionPlanningEffects } from './state/effects/effects';
import { FlightSectionPlanningFeature } from './state/flight-section-planning.feature';
import { PlanSectionsOverview } from './views/plan-section-overview/plan-section-overview.component';
import { PlanningShellComponent } from './views/planning-shell/planning-shell.component';
import { ShellComponent } from './views/shell/shell.component';
import { LoadFlightPlanTreeResolver } from './resolver/load-flight-plan-tree.resolver';
import { FlightSectionPlanService } from './services/flight-section-plan.service';
import { SectionPlanComputationMonitoringService } from './services/plan-computataion-monitoring.service';
import { SelectSectionResolver } from './resolver/select-section.resolver';
import { PlanInspectorComponent } from './views/plan-inspector/plan-inspector.component';
import { MetricsOverviewComponent } from './views/metrics-overview/metrics-overview.component';

export const routes: Routes = [
  {
    path: ':projectId',
    component: ShellComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    resolve: {projectId: LoadProjectResolver},
    providers: [
      provideState(FlightSectionPlanningFeature),
      provideEffects(flightSectionPlanningEffects),
      ProjectService,
      FlightPlanTreeService,
      ServicesService,
      DomainSpecificationService,
      FlightSectionPlanService,
      SectionPlanComputationMonitoringService,
    ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'flight-sections'
      },
      {
        path: 'flight-sections',
        component: PlanSectionsOverview,
        resolve: [LoadFlightPlanTreeResolver],
      },
      {
        path: 'metrics',
        component: MetricsOverviewComponent,
        resolve: [LoadFlightPlanTreeResolver],
      },
      {
        path: 'plan-inspection/:sectionId',
        component: PlanInspectorComponent,
        resolve: {
          sectionId: SelectSectionResolver,
          tree: LoadFlightPlanTreeResolver
        },
      },
      {
        path: 'planning',
        component: PlanningShellComponent,
        children: [
          {
            path: 'manual',
            loadChildren: () => import('../builder/builder.routes').then(m => m.routes),
          }
        ]
      },

    ]
  }
];
