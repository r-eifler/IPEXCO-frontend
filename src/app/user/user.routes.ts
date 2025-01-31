import { Routes } from '@angular/router';
import { MainPageComponent } from './view/main-page/main-page.component';
import { ShellComponent } from './view/shell/shell.component';



export const routes: Routes = [
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
