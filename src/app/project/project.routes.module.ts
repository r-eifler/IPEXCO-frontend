import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loadProjectResolver } from './resolver/load-project.resolver';
import { ProjectBaseComponent } from './view/project-base/project-base.component';


const routes: Routes = [
  {
    path: ':projectId',
    component: ProjectBaseComponent,
    resolve: { loadProjectResolver },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    children: [
      // {
      //   path: 'demos',
      //   component: ProjectsDemoCollectionComponent,
      // }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ]
})
export class ProjectRoutesModule { }
