import {HelpPageComponent} from './components/login/help-page/help-page.component';
import {MainInfoComponent} from './components/login/main-info/main-info.component';
import {Routes} from '@angular/router';
import {MainPageComponent} from './components/login/main-page/main-page.component';
import {UserMainPageComponent} from './components/user/user-main-page/user-main-page.component';
import {ProjectCollectionComponent} from './components/project/project-collection/project-collection.component';
import {ProjectBaseComponent} from './components/project/project-base/project-base.component';
import {ProjectOverviewComponent} from './components/project/project-overview/project-overview.component';
import {PropertyCollectionComponent} from './components/plan_properties/property-collection/property-collection.component';
import {ProjectIterativePlanningBaseComponent} from './components/project/project-iterative-planning-base/project-iterative-planning-base.component';
import {IterativePlanningBaseMobileComponent} from './components/iter-planning/mobile/iterative-planning-base-mobile/iterative-planning-base-mobile.component';
import {PlanningStepComponent} from './components/iter-planning/planning-step/planning-step/planning-step.component';
import {FinishedPlanningStepComponent} from './components/iter-planning/planning-step/finished-planning-step/finished-planning-step.component';
import {QuestionStepComponent} from './components/iter-planning/question-step/question-step/question-step.component';
import {FinishedQuestionStepComponent} from './components/iter-planning/question-step/finished-question-step/finished-question-step.component';
import {AnimationSettingsComponent} from './components/animation/animation-settings/animation-settings.component';
import {DemoCollectionComponent} from './components/demo/demo-collection/demo-collection.component';
import {DemoBaseComponent} from './components/demo/demo-base/demo-base.component';
import {FilesCollectionComponent} from './components/files/files-collection/files-collection.component';
import {UserStudyCollectionComponent} from './components/user-study/user-study-collection/user-study-collection.component';
import {UserStudyCreatorComponent} from './components/user-study/user-study-creator/user-study-creator.component';
import {UserStudyBaseComponent} from './components/user-study/user-study-base/user-study-base.component';
import {UserStudyStartComponent} from './components/user-study/user-study-start/user-study-start.component';
import {UserStudyExecuteComponent} from './components/user-study/user-study-execute/user-study-execute.component';
import {UserStudyEndComponent} from './components/user-study/user-study-end/user-study-end.component';
import {AuthGuard} from './route-guards/auth-guard.guard';
import {QuestionCreatorGuard} from './route-guards/question-creator.guard';
import {UserStudyNavigationComponent} from './components/user-study/user-study-navigation/user-study-navigation.component';

export const appRoutes: Routes = [
  { path: '', component: MainPageComponent},
  { path: 'info', component: MainInfoComponent},
  { path: 'help', component: HelpPageComponent},
  { path: 'overview', component: UserMainPageComponent, canActivate: [AuthGuard]},

  { path: 'projects', component: ProjectCollectionComponent , canActivate: [AuthGuard]},
  { path: 'projects/:projectid', component: ProjectBaseComponent, canActivate: [AuthGuard],
    children: [
      { path: 'overview', component: ProjectOverviewComponent},
      { path: 'properties', component: PropertyCollectionComponent},
      { path: 'iterative-planning', component: ProjectIterativePlanningBaseComponent},
      { path: 'animation-settings', component: AnimationSettingsComponent},
    ]
  },

  { path: 'demos', component: DemoCollectionComponent},
  { path: 'demos/:demoid', component: DemoBaseComponent},

  { path: 'user-studies', component: UserStudyCollectionComponent},
  { path: 'user-studies/new-user-study', component: UserStudyCreatorComponent},
  { path: 'user-studies/:userStudyId', component: UserStudyNavigationComponent,
      children: [
        { path: 'setup', component: UserStudyCreatorComponent},
        { path: 'data', component: UserStudyCreatorComponent},
      ]
  },
  { path: 'user-studies/:userStudyId/run', component: UserStudyBaseComponent,
    children: [
      { path: 'start', component: UserStudyStartComponent},
      { path: 'exec', component: UserStudyExecuteComponent},
      { path: 'end', component: UserStudyEndComponent},
    ]
  },
  { path: 'pddl-database', component: FilesCollectionComponent, canActivate: [AuthGuard]},
];
