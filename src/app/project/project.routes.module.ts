import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loadProjectResolver } from './resolver/load-project.resolver';
import { ProjectBaseComponent } from './view/project-base/project-base.component';
import { ShellComponent } from './view/shell/shell.component';
import { ProjectSettingsContainerComponent } from './view/project-settings-container/project-settings-container.component';
import { PlanningTaskViewComponent } from './view/planning-task-view/planning-task-view.component';
import { DemoCollectionComponent } from './view/demo-collection/demo-collection.component';
import { DemoDetailsViewComponent } from './view/demo-details-view/demo-details-view.component';
import { loadDemoResolver } from './resolver/load-demo.resolver';


const routes: Routes = [
  {
    path: ':projectId',
    component: ShellComponent,
    resolve: { loadProjectResolver },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'features'
      },
      {
        path: 'features',
        component: ProjectBaseComponent,
      },
      {
        path: 'planning-task',
        component: PlanningTaskViewComponent,
      },
      {
        path: 'demos/:demoId/details',
        resolve: { loadDemoResolver },
        component: DemoDetailsViewComponent,
      },
      {
        path: 'demos',
        component: DemoCollectionComponent,
      },
      {
        path: 'settings',
        component: ProjectSettingsContainerComponent,
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ]
})
export class ProjectRoutesModule { }
