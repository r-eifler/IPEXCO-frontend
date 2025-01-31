import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './view/main-page/main-page.component';
import { ShellComponent } from './view/shell/shell.component';
import { ToHomeGuard } from '../route-guards/to-home.guard';


const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    children: [
      {
        path: 'register',
        component: MainPageComponent,
        // canActivate: [ToHomeGuard]
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ]
})
export class DemoRoutesModule { }
