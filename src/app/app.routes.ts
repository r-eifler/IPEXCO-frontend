import { Routes } from '@angular/router';
import { UserMainPageComponent } from './user/view/user-main-page/user-main-page.component';
import { ProjectCollectionComponent } from './project-meta/components/project-collection/project-collection.component';
import { AuthGuard } from './route-guards/auth-guard.guard';
import {NavigationComponent} from './base/components/navigation/navigation.component';
import { MainPageComponent } from './base/components/main-page/main-page.component';
import { ToHomeGuard } from './route-guards/to-home.guard';
import { UserManualComponent } from './iterative_planning/components/user-manual/user-manual.component';
import { HelpPageComponent } from './base/components/help-page/help-page.component';

export const appRoutes: Routes = [
  {
    path: 'user-study-execution',
    loadChildren: () => import('./user_study_execution/user-study-execution.module').then(m => m.UserStudyExecutionModule),
    canActivate: [],
  },
  {
    path: '',
    redirectTo: '/overview',
    pathMatch: 'full'
  },
  {
    path: '',
    component: NavigationComponent,
    resolve: { },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    children: [
      {
        path: 'register',
        component: MainPageComponent,
        canActivate: [ToHomeGuard]
      },
      {
        path: 'overview',
        component: UserMainPageComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'projects',
        component: ProjectCollectionComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'manual',
        component: HelpPageComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'demos',
        loadChildren: () => import('./demo/demo.module').then(m => m.DemoModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'project',
        loadChildren: () => import('./project/project.module').then(m => m.ProjectModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'iterative-planning',
        loadChildren: () => import('./iterative_planning/iterative-planning.module').then(m => m.IterativePlanningModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'user-study',
        loadChildren: () => import('./user_study/user-study.module').then(m => m.UserStudyModule),
        canActivate: [AuthGuard],
      },
    ]
  }
];
