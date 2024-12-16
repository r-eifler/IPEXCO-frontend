import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './view/shell/shell.component';
import { loadUserStudyResolver } from './resolver/load-user-study.resolver';
import {UserStudyCollectionComponent} from './view/user-study-collection/user-study-collection.component';
import {UserStudyCreatorComponent} from './view/user-study-creator/user-study-creator.component';
import {UserStudyDetailsViewComponent} from './view/user-study-details-view/user-study-details-view.component';
import {UserStudyEditorComponent} from './view/user-study-editor/user-study-editor.component';
import { UserStudyEvaluationViewComponent } from './view/user-study-evaluation-view/user-study-evaluation-view.component';



const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    resolve: { },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'collection'
      },
      {
        path: 'collection',
        component: UserStudyCollectionComponent
      },
      {
        path: 'new',
        component: UserStudyCreatorComponent
      },
      {
        path: ':userStudyId/edit',
        component: UserStudyEditorComponent,
        resolve: {loadUserStudyResolver}
      },
      {
        path: ':userStudyId/details',
        component: UserStudyDetailsViewComponent,
        resolve: {loadUserStudyResolver}
      },
      {
        path: ':userStudyId/eval',
        component: UserStudyEvaluationViewComponent,
        resolve: {loadUserStudyResolver}
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ]
})
export class UserStudyRoutesModule { }
