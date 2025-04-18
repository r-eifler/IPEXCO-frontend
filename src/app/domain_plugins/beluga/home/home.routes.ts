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
      ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'projects'
      },
      {
        path: 'projects',
        component: CollectionComponent,
      }
    ]
  }
];
