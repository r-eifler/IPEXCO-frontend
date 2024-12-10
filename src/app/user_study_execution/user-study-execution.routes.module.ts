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
import {loadUserStudyExecutionStepResolver} from './resolver/load-user-study-execution-step.resolver';



const routes: Routes = [
  {
    path: '',
    component: UserStudyExecutionShellComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    children: [
      {
        path: 'fail',
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
            component: UserStudyExecutionStartViewComponent
          },
          {
            path: 'agreement',
            component: UserStudyExecutionAgreementViewComponent,
          },
          {
            path: 'step/:stepId',
            component: UserStudyExecutionStepShellComponent,
            // canActivate: [StepFinishedGuard],
            resolve: {loadUserStudyExecutionStepResolver}
          },
          {
            path: 'finish',
            component: UserStudyExecutionFinishViewComponent
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
