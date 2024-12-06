import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './view/shell/shell.component';
import { loadUserStudyResolver } from './resolver/load-user-study.resolver';
import {UserStudyCollectionComponent} from './view/user-study-collection/user-study-collection.component';
import {UserStudyCreatorComponent} from './view/user-study-creator/user-study-creator.component';



const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    resolve: { loadUserStudyResolver },
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
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ]
})
export class UserStudyRoutesModule { }
