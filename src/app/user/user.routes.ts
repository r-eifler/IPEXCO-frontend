import { Routes } from '@angular/router';
import { MainPageComponent } from './view/main-page/main-page.component';
import { ShellComponent } from './view/shell/shell.component';
import { ToHomeGuard } from '../route-guards/to-home.guard';
import { UserMainPageComponent } from './view/user-main-page/user-main-page.component';



export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: UserMainPageComponent,
        canActivate: [ToHomeGuard]
      },
      {
        path: 'register',
        component: MainPageComponent,
      }
    ]
  }
];
