import { Routes } from '@angular/router';
import { BuilderShellComponent } from './view/shell/shell.component';
import { LoadProjectResolver } from './resolver/load-project.resolver';
import { BuilderBaseComponent } from './view/builder-base/builder-base.component';
import { BuilderProjectService } from './services/project.service';
import { provideEffects } from '@ngrx/effects';
import { BuilderFeature } from './state/builder.feature';
import { builderEffects } from './state/effects/effects';
import { provideState } from '@ngrx/store';
import { SectionBuilderBaseComponent } from './view/section-builder-base/section-builder-base.component';
import { LoadFlightSectionResolver } from './resolver/load-section.resolver';
import { FlightPlanTreeService } from './services/flight-plan-tree.service';



export const routes: Routes = [
  {
    path: '',
    component: BuilderShellComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    providers: [
      provideState(BuilderFeature),
      provideEffects(builderEffects),
      BuilderProjectService,
      FlightPlanTreeService,
    ],
    children: [
      // {
      //   path: '',
      //   pathMatch: 'full',
      //   redirectTo: 'builder'
      // },
      {
        path: 'project/:projectId/section/:sectionId',
        component: SectionBuilderBaseComponent,
        resolve: [LoadProjectResolver, LoadFlightSectionResolver],
      },
      {
        path: 'project/:projectId',
        component: BuilderBaseComponent,
        resolve: [LoadProjectResolver],
      },
    ]
  }
];
