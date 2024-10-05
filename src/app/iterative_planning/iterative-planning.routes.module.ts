import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { loadProjectResolver } from './resolver/load-project.resolver';
import { ShellComponent } from './view/shell/shell.component';
import { StepsListViewComponent } from './view/steps-list-view/steps-list-view.component';


const routes: Routes = [
  {
    path: ':projectId',
    component: ShellComponent,
    resolve: { loadProjectResolver },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    children: [
      { path: '', redirectTo: 'steps', pathMatch: 'prefix' },
      {
        path: 'steps',
        component: StepsListViewComponent,
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ]
})
export class IterativePlanningRoutesModule { }
