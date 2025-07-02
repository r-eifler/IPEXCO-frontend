import { Routes } from '@angular/router';
import { ShellComponent } from './view/shell/shell.component';
import { CollectionComponent } from './view/collection/collection.component';
import { provideState } from '@ngrx/store';
import { HomeFeature } from './state/home.feature';
import { provideEffects } from '@ngrx/effects';
import { homeEffects } from './state/effects/effects';
import { CreateProjectService } from './services/create-project.service';
import { ProjectService } from './services/project.service';
import { HomeDomainSpecificationService } from './services/domainSpecification.service';
import { ProjectDetailsComponent } from './view/project-details/project-details.component';
import { LoadProjectResolver } from './resolver/load-project.resolver';
import { PlanPropertyService } from './services/plan-properties.service';
import { SettingsComponent } from './view/settings/settings.component';
import { BelugaProjectServicesService } from './services/services.service';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
      providers: [
        provideState(HomeFeature),
        provideEffects(homeEffects),
        CreateProjectService,
        ProjectService,
        HomeDomainSpecificationService,
        PlanPropertyService,
        BelugaProjectServicesService
      ],
    children: [
      {
        path: '',
        component: CollectionComponent,
      },
      {
        path: ':projectId',
        component: ProjectDetailsComponent,
        resolve: [LoadProjectResolver]
      },
      {
        path: ':projectId/settings',
        component: SettingsComponent,
        resolve: [LoadProjectResolver]
      }

    ]
  }
];
