import { Routes } from "@angular/router";
import { DemoBaseComponent } from "./demo/components/demo-base/demo-base.component";
import { HelpPageComponent } from "./base/components/help-page/help-page.component";
import { MainInfoComponent } from "./base/components/main-info/main-info.component";
import { MainPageComponent } from "./base/components/main-page/main-page.component";
import { UserMainPageComponent } from "./user/view/user-main-page/user-main-page.component";
import { ProjectCollectionComponent } from "./project-meta/components/project-collection/project-collection.component";
import { AuthGuard } from "./route-guards/auth-guard.guard";
import { DemoCollectionComponent } from "./project/view/demo-collection/demo-collection.component";

export const appRoutes: Routes = [
  { path: "", component: MainPageComponent },
  { path: "info", component: MainInfoComponent },
  { path: "help", component: HelpPageComponent },
  {
    path: "overview",
    component: UserMainPageComponent,
    canActivate: [AuthGuard],
  },
  // {
  //   path: 'llm',
  //   component: LlmBaseComponent,
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: 'llm-qt',
  //   component: LlmQtChatComponent,
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: 'llm-gt',
  //   component: LlmGtChatComponent,
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: 'llm-et',
  //   component: LlmEtChatComponent,
  //   canActivate: [AuthGuard],
  // },
  {
    path: "projects",
    component: ProjectCollectionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "project",
    loadChildren: () => import('./project/project.module').then(m => m.ProjectModule),
    canActivate: [AuthGuard],
  },
  {
    path: "iterative-planning",
    loadChildren: () => import('./iterative_planning/iterative-planning.module').then(m => m.IterativePlanningModule),
    canActivate: [AuthGuard],
  },

  // { path: "demos", component: DemoCollectionComponent },
  // { path: "demos/:demoid", component: DemoBaseComponent },

  // { path: "user-studies", component: UserStudyCollectionBaseComponent },
  // {
  //   path: "user-studies/meta-study/:metaStudyId",
  //   component: MetaStudyCreatorComponent,
  // },
  // {
  //   path: "user-studies/selection/:metaStudyId",
  //   component: StudySelectionRedirectionComponent,
  // },
  // { path: "user-studies/new-user-study", component: UserStudyCreatorComponent },
  // {
  //   path: "user-studies/:userStudyId",
  //   component: UserStudyNavigationComponent,
  //   children: [
  //     { path: "setup", component: UserStudyCreatorComponent },
  //     { path: "data", component: UserStudyCreatorComponent },
  //   ],
  // },
  // {
  //   path: "user-studies/:userStudyId/run",
  //   component: UserStudyBaseComponent,
  //   children: [
  //     { path: "start", component: UserStudyStartComponent },
  //     { path: "exec", component: UserStudyExecuteComponent },
  //     { path: "end", component: UserStudyEndComponent },
  //   ],
  // }
];
