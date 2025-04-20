import { Routes } from '@angular/router';
import { ShellComponent } from './view/shell/shell.component';
import { LoadProjectResolver } from './resolver/load-project.resolver';
import { BuilderBaseComponent } from './view/builder-base/builder-base.component';
import { ProjectService } from './services/project.service';
import { provideEffects } from '@ngrx/effects';
import { BuilderFeature } from './state/builder.feature';
import { builderEffects } from './state/effects/effects';
import { provideState } from '@ngrx/store';



export const routes: Routes = [
  {
    path: ':projectId',
    component: ShellComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    resolve: [LoadProjectResolver],
    providers: [
      provideState(BuilderFeature),
      provideEffects(builderEffects),
      ProjectService,
    ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'builder'
      },
      {
        path: 'builder',
        component: BuilderBaseComponent,
      }
    ]
  }
];
