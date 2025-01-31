import { Routes } from '@angular/router';
import { UserMainPageComponent } from './user/view/user-main-page/user-main-page.component';
import { ProjectCollectionComponent } from './project-meta/components/project-collection/project-collection.component';
import { AuthGuard } from './route-guards/auth-guard.guard';
import { NavigationComponent} from './base/components/navigation/navigation.component';
import { MainPageComponent } from './user/view/main-page/main-page.component';
import { ToHomeGuard } from './route-guards/to-home.guard';
import { HelpPageComponent } from './base/components/help-page/help-page.component';
import { provideState } from '@ngrx/store';
import { userFeature } from './user/state/user.feature';
import { provideEffects } from '@ngrx/effects';
import { userFeatureEffects } from './user/state/effects/effects';
import { AuthenticationService } from './user/services/authentication.service';

export const routes: Routes = [
  {
    path: 'user-study-execution',
    loadChildren: () => import('./user_study_execution/user-study-execution.module').then(m => m.UserStudyExecutionModule),
    providers: [
      provideState(userFeature),
      provideEffects(userFeatureEffects),
      AuthenticationService,
    ],
  },
  {
    path: '',
    redirectTo: '/user',
    pathMatch: 'full'
  },
  {
    path: '',
    component: NavigationComponent,
    resolve: { },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    providers: [
        provideState(userFeature),
        provideEffects(userFeatureEffects),
        AuthenticationService,
    ],
    children: [
      {
        path: 'user',
        loadChildren: () => import('./user/user.routes').then(m => m.routes),
      },
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
        loadChildren: () => import('./demo/demo.routes').then(m => m.routes),
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
      {
        path: 'spec',
        loadChildren: () => import('./global_specification/global_specification.routes').then(m => m.routes),
        canActivate: [AuthGuard],
      },
    ]
  }
];
