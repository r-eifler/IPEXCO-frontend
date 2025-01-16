import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserStudyExecutionShellComponent} from './view/user-study-execution-shell/user-study-execution-shell.component';
import {loadUserStudyExecutionResolver} from './resolver/load-user-study-execution.resolver';
import {UserStudyExecutionStartViewComponent} from './view/user-study-execution-start-view/user-study-execution-start-view.component';
import {UserStudyExecutionFinishViewComponent} from './view/user-study-execution-finish-view/user-study-execution-finish-view.component';
import {
  UserStudyExecutionDescriptionViewComponent
} from './view/user-study-execution-description-view/user-study-execution-description-view.component';
import {UserStudyExecutionDemoViewComponent} from './view/user-study-execution-demo-view/user-study-execution-demo-view.component';
import {
  UserStudyExecutionExternalViewComponent
} from './view/user-study-execution-external-view/user-study-execution-external-view.component';
import {
  UserStudyExecutionAgreementViewComponent
} from './view/user-study-execution-agreement-view/user-study-execution-agreement-view.component';
import {StepFinishedGuard} from '../route-guards/step-finished-guard.guard';
import {UserStudyExecutionStepShellComponent} from './view/user-study-execution-step-shell/user-study-execution-step-shell.component';
import {UserStudyExecutionFailViewComponent} from './view/user-study-execution-fail-view/user-study-execution-fail-view.component';
import {AuthGuard} from '../route-guards/auth-guard.guard';
import {UserStudyExecutionCancelViewComponent} from './view/user-study-execution-cancel-view/user-study-execution-cancel-view.component';
import {UserStudyAuthGuard} from '../route-guards/user-study-auth.guard';
import { LogOutUserStudyAuthGuard } from '../route-guards/user-study-logout.guard';
import { distributeParticipantsResolver } from './resolver/distribute-participant.resolver';



const routes: Routes = [
  {
    path: '',
    component: UserStudyExecutionShellComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
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
                loadChildren: () => import('../iterative_planning/iterative-planning.module').then(m => m.IterativePlanningModule),
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
