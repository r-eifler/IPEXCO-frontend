import { Routes } from '@angular/router';
import { SectionForestComponent } from './views/section-tree/section-forest.component';
import { ShellComponent } from './views/shell/shell.component';
import { FlightSectionPlanningFeature } from './state/flight-section-planning.feature';
import { provideState } from '@ngrx/store';
import { flightSectionPlanningEffects } from './state/effects/effects';
import { ProjectService } from './services/project.service';
import { provideEffects } from '@ngrx/effects';
import { LoadProjectResolver } from './resolver/load-project.resolver';

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
    ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'flight-sections'
      },
      {
        path: 'flight-sections',
        component: SectionForestComponent,
      },

    ]
  }
];
