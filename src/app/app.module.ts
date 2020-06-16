import { UserService } from './service/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DemosService, RunningDemoService } from './service/demo-services';
import { DisplayTaskService } from './service/display-task.service';
import { ViewSettingsService } from './service/setting.service';
import { TaskSchemaService } from './service/schema.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InlineSVGModule } from 'ng-inline-svg';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {CdkTableModule} from '@angular/cdk/table';
import { FooterComponent } from './components/footer/footer.component';

// Material
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LayoutModule } from '@angular/cdk/layout';
import { MatTabsModule } from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDividerModule} from '@angular/material/divider';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatListModule} from '@angular/material/list';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {MatChipsModule} from '@angular/material/chips';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTreeModule} from '@angular/material/tree';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatBadgeModule} from '@angular/material/badge';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTableModule} from '@angular/material/table';
import {MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, MatBottomSheetModule} from '@angular/material/bottom-sheet';

import {ResizableModule} from 'angular-resizable-element';


// forms
import { ReactiveFormsModule } from '@angular/forms';
import {FormsModule} from '@angular/forms';

// my components
import { PropertySelectorComponent} from './components/iter-planning/property-selector/property-selector.component';
import { TemplateFileUploadComponent } from './components/files/file-upload/file-upload.component';
import { DomainSelectorComponent } from './components/files/domain-selector/domain-selector.component';
import { ProblemSelectorComponent } from './components/files/problem-selector/problem-selector.component';
import { PropertyCreatorComponent } from './components/plan_properties/property-creator/property-creator.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ProjectSelectionComponent } from './components/project/project-selection/project-selection.component';
import { ProjectCreatorComponent } from './components/project/project-creator/project-creator.component';
import { PlannerService } from './service/planner.service';
import { ProjectBaseComponent } from './components/project/project-base/project-base.component';
import { PropertyCollectionComponent } from './components/plan_properties/property-collection/property-collection.component';
import { IterativePlanningBaseComponent } from './components/iter-planning/iterative-planning-base/iterative-planning-base.component';
import { TaskViewComponent } from './components/iter-planning/planning-step/task-view/task-view.component';
import { PlanViewComponent } from './components/iter-planning/planning-step/plan-view/plan-view.component';
import { QuestionStepComponent } from './components/iter-planning/question-step/question-step/question-step.component';
import { PlanningStepComponent } from './components/iter-planning/planning-step/planning-step/planning-step.component';
import { FinishedPlanningStepComponent } from './components/iter-planning/planning-step/finished-planning-step/finished-planning-step.component';
import { FinishedQuestionStepComponent } from './components/iter-planning/question-step/finished-question-step/finished-question-step.component';
import { TaskCreatorComponent } from './components/iter-planning/planning-step/task-creator/task-creator.component';
import { FirstPlanningStepComponent } from './components/iter-planning/planning-step/first-planning-step/first-planning-step.component';
import { QuestionCreatorComponent } from './components/iter-planning/question-step/question-creator/question-creator.component';
import { QuestionViewComponent } from './components/iter-planning/question-step/question-view/question-view.component';
import { ExplanationViewComponent } from './components/iter-planning/question-step/explanation-view/explanation-view.component';


// editor
import { MonacoEditorModule} from 'ngx-monaco-editor';

// Store
import {PddlFileUtilsService} from './service/pddl-file-utils.service';
import {
  CurrentProjectStore, CurrentRunStore,
  DomainFilesStore, PlanPropertyCollectionStore,
  ProblemFilesStore,
  ProjectsStore, RunsStore,
  SelectedDomainFileStore,
  SelectedProblemFileStore,
  CurrentQuestionStore,
  TasktSchemaStore,
  DomainSpecificationFilesStore,
  DomainSpecStore,
  ViewSettingsStore,
  DisplayTaskStore,
  DemosStore,
  RunningDemoStore,
  UserStore,
  ExecutionSettingsStore
} from './store/stores.store';
import {
  DomainFilesService,
  ProblemFilesService,
  SelectedDomainFileService,
  SelectedProblemFileService,
  DomainSpecificationFilesService
} from './service/pddl-file-services';
import {
  RunService,
  CurrentRunService,
  CurrentQuestionService
} from './service/run-services';
import { ProjectsService, CurrentProjectService} from './service/project-services';
import { PlanPropertyCollectionService} from './service/plan-property-services';
import { LoginComponent } from './components/login/login/login.component';
import { DemoSelectionComponent } from './components/demo/demo-selection/demo-selection.component';
import { DemoBaseComponent } from './components/demo/demo-base/demo-base.component';
import { MobilMenuComponent } from './components/settings/mobil-menu/mobil-menu.component';
import { DemoSettingsComponent } from './components/demo/demo-settings/demo-settings.component';
import { ProjectOverviewComponent } from './components/project/project-overview/project-overview.component';
import { DomainSpecificationComponent } from './components/files/domain-specification/domain-specification.component';
import { ViewSettingsMenuComponent } from './components/settings/view-settings-menu/view-settings-menu.component';
import { RunTreeComponent } from './components/iter-planning/run-tree/run-tree.component';
import { IterativePlanningBaseMobileComponent }
from './components/iter-planning/mobile/iterative-planning-base-mobile/iterative-planning-base-mobile.component';
import { PlanAnimationViewComponent } from './components/iter-planning/planning-step/plan-animation-view/plan-animation-view.component';
import { NomysteryTaskViewComponent } from './components/plugins/nomystery/nomystery-task-view/nomystery-task-view.component';
import { AnimationHandler } from './plan-visualization/integration/animation-handler';
import { PlanVisualizationProvider } from './provider/plan-visualisation.provider';
import { DemoCreatorComponent } from './components/demo/demo-creator/demo-creator.component';
import { DemoHelpComponent } from './components/demo/demo-help/demo-help.component';
import { DemoNavigatorComponent } from './components/demo/demo-navigator/demo-navigator.component';
import { MainPageComponent } from './components/login/main-page/main-page.component';
import { RegisterComponent } from './components/login/register/register.component';
import { AutheticationInterceptor } from './interceptor/authentication.interceptor';
import { UserMainPageComponent } from './components/user/user-main-page/user-main-page.component';
import { FilesCollectionComponent } from './components/files/files-collection/files-collection.component';
import { ExecutionSettingsService } from './service/execution-settings.service';



const appRoutes: Routes = [
    { path: '', component: MainPageComponent},
    {path: 'overview', component: UserMainPageComponent},
    { path: 'projects', component: ProjectSelectionComponent},
    { path: 'projects/:projectid', component: ProjectBaseComponent,
      children: [
        { path: 'overview', component: ProjectOverviewComponent},
        { path: 'properties', component: PropertyCollectionComponent},
        { path: 'iterative-planning', component: IterativePlanningBaseComponent,
          children: [
            { path: 'run-overview-mobile', component: IterativePlanningBaseMobileComponent},
            { path: 'new-planning-step', component: PlanningStepComponent},
            { path: 'original-task', component: FirstPlanningStepComponent},
            { path: 'planning-step/:runid', component: FinishedPlanningStepComponent},
            { path: 'planning-step/:runid/new-question', component: QuestionStepComponent},
            { path: 'planning-step/:runid/question-step/:expid', component: FinishedQuestionStepComponent},
          ]
        }
      ]
    },
    { path: 'demos', component: DemoSelectionComponent},
    { path: 'demos/:demoid', component: DemoBaseComponent,
      children: [
        { path: 'help', component: DemoHelpComponent},
        { path: 'nav', component: DemoNavigatorComponent,
          children: [
            { path: 'new-planning-step', component: PlanningStepComponent},
            { path: 'original-task', component: FirstPlanningStepComponent},
            { path: 'planning-step/:runid', component: FinishedPlanningStepComponent},
            { path: 'planning-step/:runid/new-question', component: QuestionStepComponent},
            { path: 'planning-step/:runid/question-step/:expid', component: FinishedQuestionStepComponent}
          ]
        }
      ]
    },
    { path: 'uploaded-files', component: FilesCollectionComponent},
    { path: 'domain-files', component: DomainSelectorComponent},
    { path: 'problem-files', component: ProblemSelectorComponent},
    { path: 'domain-specification', component: DomainSpecificationComponent},
];


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    PropertySelectorComponent,
    TemplateFileUploadComponent,
    DomainSelectorComponent,
    ProblemSelectorComponent,
    PropertyCreatorComponent,
    NavigationComponent,
    ProjectSelectionComponent,
    ProjectCreatorComponent,
    ProjectBaseComponent,
    PropertyCollectionComponent,
    IterativePlanningBaseComponent,
    TaskViewComponent,
    PlanViewComponent,
    QuestionStepComponent,
    PlanningStepComponent,
    FinishedPlanningStepComponent,
    FinishedQuestionStepComponent,
    TaskCreatorComponent,
    FirstPlanningStepComponent,
    QuestionCreatorComponent,
    QuestionViewComponent,
    ExplanationViewComponent,
    LoginComponent,
    DemoSelectionComponent,
    DemoBaseComponent,
    MobilMenuComponent,
    DemoSettingsComponent,
    ProjectOverviewComponent,
    DomainSpecificationComponent,
    ViewSettingsMenuComponent,
    RunTreeComponent,
    IterativePlanningBaseMobileComponent,
    PlanViewComponent,
    NomysteryTaskViewComponent,
    PlanAnimationViewComponent,
    DemoCreatorComponent,
    DemoHelpComponent,
    DemoNavigatorComponent,
    MainPageComponent,
    RegisterComponent,
    UserMainPageComponent,
    FilesCollectionComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CdkTableModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    LayoutModule,
    MatTabsModule,
    MatExpansionModule,
    DragDropModule,
    MatStepperModule,
    MatDividerModule,
    MatInputModule,
    MatRadioModule,
    MatButtonToggleModule,
    MatSidenavModule,
    MatToolbarModule,
    MatSelectModule,
    MatDialogModule,
    MatChipsModule,
    MatTreeModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    FormsModule,
    MonacoEditorModule.forRoot(),
    MatListModule,
    MatAutocompleteModule,
    MatSliderModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatBottomSheetModule,
    MatSlideToggleModule,
    MatTableModule,
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: false, // <-- debugging purposes only
        paramsInheritanceStrategy: 'always'}
    ),
    ResizableModule,
    InlineSVGModule.forRoot(),
  ],
  providers: [
    UserStore,
    UserService,
    { provide: HTTP_INTERCEPTORS, useClass: AutheticationInterceptor, multi: true },
    AutheticationInterceptor,
    ExecutionSettingsStore,
    ExecutionSettingsService,
    DomainFilesStore,
    SelectedDomainFileStore,
    ProblemFilesStore,
    SelectedProblemFileStore,
    PddlFileUtilsService,
    DomainFilesService,
    SelectedDomainFileService,
    ProblemFilesService,
    SelectedProblemFileService,
    DomainSpecificationFilesStore,
    DomainSpecificationFilesService,
    ProjectsStore,
    ProjectsService,
    CurrentProjectStore,
    CurrentProjectService,
    TasktSchemaStore,
    TaskSchemaService,
    PlanPropertyCollectionStore,
    PlanPropertyCollectionService,
    PlannerService,
    RunsStore,
    CurrentRunService,
    CurrentRunStore,
    CurrentQuestionStore,
    CurrentQuestionService,
    DomainSpecStore,
    ViewSettingsStore,
    ViewSettingsService,
    DemosStore,
    DemosService,
    RunningDemoStore,
    RunningDemoService,
    DisplayTaskStore,
    DisplayTaskService,
    AnimationHandler,
    {provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}},
    PlanVisualizationProvider,
    MatSnackBar

  ],
  entryComponents: [
    PropertySelectorComponent,
    PropertyCreatorComponent,
    ProjectSelectionComponent,
    ProjectCreatorComponent,
    DemoCreatorComponent,
    PropertyCollectionComponent,
    DemoSettingsComponent,
    ViewSettingsMenuComponent,
    RegisterComponent,
    LoginComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

