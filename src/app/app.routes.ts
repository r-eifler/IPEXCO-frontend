import { Routes } from "@angular/router";
import { DemoBaseComponent } from "./components/demo/demo-base/demo-base.component";
import { DemoCollectionComponent } from "./components/demo/demo-collection/demo-collection.component";
import { FilesCollectionComponent } from "./components/files/files-collection/files-collection.component";
import { HelpPageComponent } from "./components/login/help-page/help-page.component";
import { MainInfoComponent } from "./components/login/main-info/main-info.component";
import { MainPageComponent } from "./components/login/main-page/main-page.component";
import { MetaStudyCreatorComponent } from "./components/user-study/meta-study/meta-study-creator/meta-study-creator.component";
import { StudySelectionRedirectionComponent } from "./components/user-study/meta-study/study-selection-redirection/study-selection-redirection.component";
import { UserStudyBaseComponent } from "./components/user-study/user-study-base/user-study-base.component";
import { UserStudyCollectionBaseComponent } from "./components/user-study/user-study-collection-base/user-study-collection-base.component";
import { UserStudyCreatorComponent } from "./components/user-study/user-study-creator/user-study-creator.component";
import { UserStudyEndComponent } from "./components/user-study/user-study-end/user-study-end.component";
import { UserStudyExecuteComponent } from "./components/user-study/user-study-execute/user-study-execute.component";
import { UserStudyNavigationComponent } from "./components/user-study/user-study-navigation/user-study-navigation.component";
import { UserStudyStartComponent } from "./components/user-study/user-study-start/user-study-start.component";
import { UserMainPageComponent } from "./components/user/user-main-page/user-main-page.component";
import { ProjectCollectionComponent } from "./project-meta/components/project-collection/project-collection.component";
import { ProjectBaseComponent } from "./project/components/project-base/project-base.component";
import { AuthGuard } from "./route-guards/auth-guard.guard";

export const appRoutes: Routes = [
  { path: "", component: MainPageComponent },
  { path: "info", component: MainInfoComponent },
  { path: "help", component: HelpPageComponent },
  {
    path: "overview",
    component: UserMainPageComponent,
    canActivate: [AuthGuard],
  },

  {
    path: "projects",
    component: ProjectCollectionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "projects/:projectid",
    component: ProjectBaseComponent,
    canActivate: [AuthGuard],
    children: [],
  },
  {
    path: "iterative-planning",
    loadChildren: () => import('./iterative_planning/iterative-planning.module').then(m => m.IterativePlanningModule),
    canActivate: [AuthGuard],
  },

  { path: "demos", component: DemoCollectionComponent },
  { path: "demos/:demoid", component: DemoBaseComponent },

  { path: "user-studies", component: UserStudyCollectionBaseComponent },
  {
    path: "user-studies/meta-study/:metaStudyId",
    component: MetaStudyCreatorComponent,
  },
  {
    path: "user-studies/selection/:metaStudyId",
    component: StudySelectionRedirectionComponent,
  },
  { path: "user-studies/new-user-study", component: UserStudyCreatorComponent },
  {
    path: "user-studies/:userStudyId",
    component: UserStudyNavigationComponent,
    children: [
      { path: "setup", component: UserStudyCreatorComponent },
      { path: "data", component: UserStudyCreatorComponent },
    ],
  },
  {
    path: "user-studies/:userStudyId/run",
    component: UserStudyBaseComponent,
    children: [
      { path: "start", component: UserStudyStartComponent },
      { path: "exec", component: UserStudyExecuteComponent },
      { path: "end", component: UserStudyEndComponent },
    ],
  },
  {
    path: "pddl-database",
    component: FilesCollectionComponent,
    canActivate: [AuthGuard],
  },
];
