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



const routes: Routes = [
  {
    path: ':userStudyId',
    component: UserStudyExecutionShellComponent,
    resolve: { loadUserStudyExecutionResolver },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
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
        path: 'description/:stepId',
        component: UserStudyExecutionDescriptionViewComponent,
      },
      {
        path: 'demo/:stepId',
        component: UserStudyExecutionDemoViewComponent,
      },
      {
        path: 'external/:stepId',
        component: UserStudyExecutionExternalViewComponent,
      },
      {
        path: 'finish',
        component: UserStudyExecutionFinishViewComponent
      },
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ]
})
export class UserStudyExecutionRoutesModule { }
