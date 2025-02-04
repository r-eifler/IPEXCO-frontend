import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserStudyExecutionShellComponent} from './view/user-study-execution-shell/user-study-execution-shell.component';
import {loadUserStudyExecutionResolver} from './resolver/load-user-study-execution.resolver';
import {UserStudyExecutionStartViewComponent} from './view/user-study-execution-start-view/user-study-execution-start-view.component';
import {UserStudyExecutionFinishViewComponent} from './view/user-study-execution-finish-view/user-study-execution-finish-view.component';
import {
  UserStudyExecutionAgreementViewComponent
} from './view/user-study-execution-agreement-view/user-study-execution-agreement-view.component';
import {UserStudyExecutionStepShellComponent} from './view/user-study-execution-step-shell/user-study-execution-step-shell.component';
import {UserStudyExecutionFailViewComponent} from './view/user-study-execution-fail-view/user-study-execution-fail-view.component';
import {UserStudyExecutionCancelViewComponent} from './view/user-study-execution-cancel-view/user-study-execution-cancel-view.component';
import {UserStudyAuthGuard} from '../route-guards/user-study-auth.guard';
import { LogOutUserStudyAuthGuard } from '../route-guards/user-study-logout.guard';
import { distributeParticipantsResolver } from './resolver/distribute-participant.resolver';
import { provideState } from '@ngrx/store';
import { userStudyExecutionFeature } from './state/user-study-execution.feature';
import { provideEffects } from '@ngrx/effects';
import { userStudyExecutionFeatureEffects } from './state/effects/effects';
import { ExecutionUserStudyService } from './service/execution-user-study.service';
import { UserStudyAuthenticationService } from './service/user-study-authentication.service';
import { UserStudyExecutionDemoService } from './service/user-study-execution-demo.service';
import { UserStudyExecutionPlanPropertyService } from './service/user-study-execution-plan-properties.service';
import { UserStudyExecutionService } from './service/user-study-execution.service';
import { NextUserStudyService } from './service/user-study-selection.service';



export const routes: Routes = [
  {
    path: '',
    component: UserStudyExecutionShellComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    providers: [
      provideState(userStudyExecutionFeature),
      provideEffects(userStudyExecutionFeatureEffects),
      ExecutionUserStudyService,
      UserStudyExecutionDemoService,
      UserStudyAuthenticationService,
      UserStudyExecutionPlanPropertyService,
      UserStudyExecutionService,
      NextUserStudyService
    ],
    children: [
      {
        path: 'fail',
        component: UserStudyExecutionFailViewComponent,
        canActivate: [LogOutUserStudyAuthGuard]
      },
      {
        path: 'canceled',
        component: UserStudyExecutionCancelViewComponent,
      },
      {
        path: 'distribution/:distributionId',
        resolve: {distributeParticipantsResolver},
        component: UserStudyExecutionFailViewComponent,
      },
      {
        path: ':userStudyId',
        resolve: {loadUserStudyExecutionResolver},
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'start'
          },
          {
            path: 'start',
            component: UserStudyExecutionStartViewComponent,
            canActivate: [LogOutUserStudyAuthGuard]
          },
          {
            path: 'agreement',
            component: UserStudyExecutionAgreementViewComponent,
          },
          {
            path: 'step',
            component: UserStudyExecutionStepShellComponent,
            canActivate: [UserStudyAuthGuard],
            children: [
              {
                path: 'iterative-planning',
                loadChildren: () => import('../iterative_planning/iterative-planning.routes').then(m => m.routes),
              },
            ]
          },
          {
            path: 'finish',
            component: UserStudyExecutionFinishViewComponent,
            canActivate: [UserStudyAuthGuard],
          }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ]
})
export class UserStudyExecutionRoutesModule { }
