import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { LoadFlightPlanTreeResolver } from './resolver/load-flight-plan-tree.resolver';
import { LoadProjectResolver } from './resolver/load-project.resolver';
import { SelectConfigurationResolver } from './resolver/select-config.resolver';
import { SelectSectionResolver } from './resolver/select-section.resolver';
import { DomainSpecificationService } from './services/domainSpecification.service';
import { SectionExplanationComputationMonitoringService } from './services/explanation-computataion-monitoring.service';
import { FlightPlanTreeService } from './services/flight-plan-tree.service';
import { FlightSectionExplanationService } from './services/flight-section-explanation.service';
import { FlightSectionPlanService } from './services/flight-section-plan.service';
import { SectionPlanComputationMonitoringService } from './services/plan-computataion-monitoring.service';
import { ProjectService } from './services/project.service';
import { ServicesService } from './services/services.service';
import { flightSectionPlanningEffects } from './state/effects/effects';
import { FlightSectionPlanningFeature } from './state/flight-section-planning.feature';
import { ConfigurationExplanationViewComponent } from './views/configuration-explanation-view/configuration-explanation-view.component';
import { ConfigurationUpdateViewComponent } from './views/configuration-update-view/configuration-update-view.component';
import { MetricsOverviewComponent } from './views/metrics-overview/metrics-overview.component';
import { PlanInspectorComponent } from './views/plan-inspector/plan-inspector.component';
import { PlanSectionsOverview } from './views/plan-section-overview/plan-section-overview.component';
import { PlanningShellComponent } from './views/planning-shell/planning-shell.component';
import { ShellComponent } from './views/shell/shell.component';

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
      FlightSectionExplanationService,
      SectionExplanationComputationMonitoringService,
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
        path: 'configuration-update/:sectionId',
        component: ConfigurationUpdateViewComponent,
        resolve: {
          sectionId: SelectSectionResolver,
          configIndex: SelectConfigurationResolver,
          tree: LoadFlightPlanTreeResolver
        },
      },
      {
        path: 'configuration-explanations/:sectionId/:configIndex',
        component: ConfigurationExplanationViewComponent,
        resolve: {
          sectionId: SelectSectionResolver,
          configIndex: SelectConfigurationResolver,
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
