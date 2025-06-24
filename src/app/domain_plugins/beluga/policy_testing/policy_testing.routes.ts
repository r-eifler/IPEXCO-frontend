import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { PolicyTestingShellComponent } from './view/policy-testing-shell/policy-testing-shell.component';
import { policyTestingEffects } from './state/effects/effects';
import { LoadProjectResolver } from './resolver/load-project.resolver';
import { PolicyTestingFeature } from './state/policy-testing.feature';
import { BaseComponent } from './view/base/base.component';


export const routes: Routes = [
  {
    path: '',
    component: PolicyTestingShellComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    providers: [
      provideState(PolicyTestingFeature),
      provideEffects(policyTestingEffects,),
    ],
    children: [
      {
        path: ':projectId',
        component: BaseComponent,
        resolve: [LoadProjectResolver],
      },
    ]
  }
];
