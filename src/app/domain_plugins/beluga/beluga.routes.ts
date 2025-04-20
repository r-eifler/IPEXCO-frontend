import { Routes } from '@angular/router';
import { BelugaNavigationComponent } from './navigation/navigation.component';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { FailureEffect } from 'src/app/shared/effects/failure.effect';
import { AuthenticationService } from 'src/app/user/services/authentication.service';
import { userFeatureEffects } from 'src/app/user/state/effects/effects';
import { userFeature } from 'src/app/user/state/user.feature';
import { TranslocoHttpLoader } from './transloco-loader';

export const routes: Routes = [
  {
    path: '',
    component: BelugaNavigationComponent,
    providers: [
      provideState(userFeature),
      provideEffects([...userFeatureEffects,FailureEffect] ),
      AuthenticationService,
      TranslocoHttpLoader,
    ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
      },
      {
        path: 'home',
        loadChildren: () => import('./home/home.routes').then(m => m.routes),
      },
      {
        path: 'manual-planning',
        loadChildren: () => import('./builder/builder.routes').then(m => m.routes),
      }
    ]
  }
];
