import { Routes } from '@angular/router';
import { ShellComponent } from './views/shell/shell.component';
import { FlightSectionPlanningFeature } from './state/flight-section-planning.feature';
import { provideState } from '@ngrx/store';
import { flightSectionPlanningEffects } from './state/effects/effects';
import { ProjectService } from './services/project.service';
import { provideEffects } from '@ngrx/effects';
import { LoadProjectResolver } from './resolver/load-project.resolver';
import { FlightPlanTreeService } from './services/flight-plan-tree.service';
import { PlanSectionsOverview } from './views/plan-section-overview/plan-section-overview.component';
import { ServicesService } from './services/services.service';
import { DomainSpecificationService } from './services/domainSpecification.service';

export const routes: Routes = [
  {
    path: ':projectId',
    component: ShellComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    resolve: [LoadProjectResolver],
    providers: [
      provideState(FlightSectionPlanningFeature),
      provideEffects(flightSectionPlanningEffects),
      ProjectService,
      FlightPlanTreeService,
      ServicesService,
      DomainSpecificationService,
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
      },

    ]
  }
];
