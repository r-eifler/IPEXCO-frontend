import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './view/shell/shell.component';
import { DemosCollectionViewComponent } from './view/demos-collection-view/demos-collection-view.component';
import { DemoDetailsViewComponent } from './view/demo-details-view/demo-details-view.component';
import { loadDemoResolver } from './resolver/load-demo.resolver';



const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'collection'
      },
      {
        path: 'collection',
        component: DemosCollectionViewComponent,
      },
      {
        path: ':demoId/details',
        component: DemoDetailsViewComponent,
        resolve: { loadDemoResolver }
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ]
})
export class DemoRoutesModule { }
