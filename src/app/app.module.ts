import {AnimationSettingsDirective} from './components/animation/animation-settings.directive';
import {AuthenticationService} from './service/authentication/authentication.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DemosService, RunningDemoService} from './service/demo/demo-services';
import {ViewSettingsService} from './service/settings/setting.service';
import {TaskSchemaService} from './service/task-info/schema.service';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {InlineSVGModule} from 'ng-inline-svg';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {CdkTableModule} from '@angular/cdk/table';
import {FooterComponent} from './components/footer/footer.component';
// Material
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {LayoutModule} from '@angular/cdk/layout';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDividerModule} from '@angular/material/divider';
import {DragDropModule} from '@angular/cdk/drag-drop';
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
import { MatCarouselModule } from '@ngmodule/material-carousel';

import {ResizableModule} from 'angular-resizable-element';
// forms
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// my components
import {TemplateFileUploadComponent} from './components/files/file-upload/file-upload.component';
import {DomainSelectorComponent} from './components/files/domain-selector/domain-selector.component';
import {ProblemSelectorComponent} from './components/files/problem-selector/problem-selector.component';
import {PropertyCreatorComponent} from './components/plan_properties/property-creator/property-creator.component';
import {NavigationComponent} from './components/navigation/navigation.component';
import {ProjectCollectionComponent} from './components/project/project-collection/project-collection.component';
import {ProjectCreatorComponent} from './components/project/project-creator/project-creator.component';
import {PlannerService} from './service/planner-runs/planner.service';
import {ProjectBaseComponent} from './components/project/project-base/project-base.component';
import {PropertyCollectionComponent} from './components/plan_properties/property-collection/property-collection.component';
import {IterativePlanningBaseComponent} from './components/iter-planning/iterative-planning-base/iterative-planning-base.component';
import {TaskViewComponent} from './components/iter-planning/planning-step/task-view/task-view.component';
import {PlanViewComponent} from './components/iter-planning/planning-step/plan-view/plan-view.component';
import {QuestionStepComponent} from './components/iter-planning/question-step/question-step/question-step.component';
import {PlanningStepComponent} from './components/iter-planning/planning-step/planning-step/planning-step.component';
import {
  FinishedPlanningStepComponent
} from './components/iter-planning/planning-step/finished-planning-step/finished-planning-step.component';
import {
  FinishedQuestionStepComponent
} from './components/iter-planning/question-step/finished-question-step/finished-question-step.component';
import {TaskCreatorComponent} from './components/iter-planning/planning-step/task-creator/task-creator.component';
import {QuestionCreatorComponent} from './components/iter-planning/question-step/question-creator/question-creator.component';
import {QuestionViewComponent} from './components/iter-planning/question-step/question-view/question-view.component';
import {AnswerViewComponent} from './components/iter-planning/question-step/answer-view/answer-view.component';
// Store
import {PddlFileUtilsService} from './service/files/pddl-file-utils.service';
import {
  CurrentProjectStore,
  CurrentQuestionStore,
  CurrentRunStore,
  DemosStore,
  DomainFilesStore,
  DomainSpecificationFilesStore,
  DomainSpecStore,
  ExecutionSettingsStore,
  PlanPropertyMapStore,
  ProblemFilesStore,
  ProjectsStore,
  RunningDemoStore,
  RunningUserStudyStore,
  RunsStore,
  TaskSchemaStore,
  UserStore,
  UserStudiesStore,
  ViewSettingsStore
} from './store/stores.store';
import {
  DomainFilesService,
  DomainSpecificationFilesService,
  ProblemFilesService,
} from './service/files/pddl-file-services';
import {CurrentProjectService, ProjectsService} from './service/project/project-services';
import {PlanPropertyMapService} from './service/plan-properties/plan-property-services';
import {LoginComponent} from './components/login/login/login.component';
import {DemoCollectionComponent} from './components/demo/demo-collection/demo-collection.component';
import {DemoBaseComponent} from './components/demo/demo-base/demo-base.component';
import {DemoSettingsComponent} from './components/demo/demo-settings/demo-settings.component';
import {ProjectOverviewComponent} from './components/project/project-overview/project-overview.component';
import {DomainSpecificationComponent} from './components/files/domain-specification/domain-specification.component';
import {ViewSettingsMenuComponent} from './components/settings/view-settings-menu/view-settings-menu.component';
import {RunTreeComponent} from './components/iter-planning/run-tree/run-tree.component';
import {
  IterativePlanningBaseMobileComponent
} from './components/iter-planning/mobile/iterative-planning-base-mobile/iterative-planning-base-mobile.component';
import {PlanAnimationViewComponent} from './components/iter-planning/planning-step/plan-animation-view/plan-animation-view.component';
import {NomysteryTaskViewComponent} from './components/plugins/nomystery/nomystery-task-view/nomystery-task-view.component';
import {AnimationHandler} from './plan-visualization/integration/animation-handler';
import {PlanVisualizationProvider} from './provider/plan-visualisation.provider';
import {DemoCreatorComponent} from './components/demo/demo-creator/demo-creator.component';
import {DemoHelpComponent} from './components/demo/demo-help/demo-help.component';
import {DemoNavigatorComponent} from './components/demo/demo-navigator/demo-navigator.component';
import {MainPageComponent} from './components/login/main-page/main-page.component';
import {RegisterComponent} from './components/login/register/register.component';
import {AuthenticationInterceptor} from './interceptor/authentication.interceptor';
import {UserMainPageComponent} from './components/user/user-main-page/user-main-page.component';
import {FilesCollectionComponent} from './components/files/files-collection/files-collection.component';
import {ExecutionSettingsService} from './service/settings/execution-settings.service';
import {AnimationSettingsComponent} from './components/animation/animation-settings/animation-settings.component';
import {
  AnimationSettingsNomysteryComponent
} from './components/plugins/nomystery/animation-settings-nomystery/animation-settings-nomystery.component';
import {AnimationsSettingsDemoComponent} from './components/animation/animations-settings-demo/animations-settings-demo.component';
import {MainInfoComponent} from './components/login/main-info/main-info.component';
import {appRoutes} from './app.routes';
import {HelpPageComponent} from './components/login/help-page/help-page.component';
import {DemoFinishedComponent} from './components/demo/demo-finished/demo-finished.component';
import {DemoTaskIntroComponent} from './components/demo/demo-task-intro/demo-task-intro.component';
import {UserStudyCollectionComponent} from './components/user-study/user-study-collection/user-study-collection.component';
import {UserStudyCreatorComponent} from './components/user-study/user-study-creator/user-study-creator.component';
import {RunningUserStudyService, UserStudiesService} from './service/user-study/user-study-services';
import {UserStudyBaseComponent} from './components/user-study/user-study-base/user-study-base.component';
import {UserStudyDescriptionViewComponent} from './components/user-study/user-study-description-view/user-study-description-view.component';
import {UserStudyFormViewComponent} from './components/user-study/user-study-form-view/user-study-form-view.component';
import {UserStudyDemoViewComponent} from './components/user-study/user-study-demo-view/user-study-demo-view.component';
import {UserStudyStartComponent} from './components/user-study/user-study-start/user-study-start.component';
import {UserStudyExecuteComponent} from './components/user-study/user-study-execute/user-study-execute.component';
import {UserStudyEndComponent} from './components/user-study/user-study-end/user-study-end.component';
import {SelectedPlanRunService} from './service/planner-runs/selected-planrun.service';
import {SelectedQuestionService} from './service/planner-runs/selected-question.service';
import { MarkedPipe } from './pipes/marked.pipe';

import { DemoHelpDialogComponent } from './components/demo/demo-help-dialog/demo-help-dialog.component';
import { ScalableListComponent } from './components/utils/scalable-list/scalable-list.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    TemplateFileUploadComponent,
    DomainSelectorComponent,
    ProblemSelectorComponent,
    PropertyCreatorComponent,
    NavigationComponent,
    ProjectCollectionComponent,
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
    QuestionCreatorComponent,
    QuestionViewComponent,
    AnswerViewComponent,
    LoginComponent,
    DemoCollectionComponent,
    DemoBaseComponent,
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
    AnimationSettingsComponent,
    AnimationSettingsNomysteryComponent,
    AnimationSettingsDirective,
    AnimationsSettingsDemoComponent,
    MainInfoComponent,
    HelpPageComponent,
    DemoFinishedComponent,
    DemoTaskIntroComponent,
    UserStudyCollectionComponent,
    UserStudyCreatorComponent,
    UserStudyBaseComponent,
    UserStudyDescriptionViewComponent,
    UserStudyFormViewComponent,
    UserStudyDemoViewComponent,
    UserStudyStartComponent,
    UserStudyExecuteComponent,
    UserStudyEndComponent,
    MarkedPipe,
    DemoHelpDialogComponent,
    ScalableListComponent,
  ],
  imports: [
    RouterModule.forRoot(appRoutes,
      {enableTracing: false, paramsInheritanceStrategy: 'always'}
    ),
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
    MatListModule,
    MatAutocompleteModule,
    MatSliderModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatBottomSheetModule,
    MatSlideToggleModule,
    MatTableModule,
    ResizableModule,
    InlineSVGModule.forRoot(),
    MatCarouselModule.forRoot(),
  ],
  providers: [
    UserStore,
    AuthenticationService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
    AuthenticationInterceptor,
    ExecutionSettingsStore,
    ExecutionSettingsService,
    DomainFilesStore,
    ProblemFilesStore,
    PddlFileUtilsService,
    DomainFilesService,
    ProblemFilesService,
    DomainSpecificationFilesStore,
    DomainSpecificationFilesService,
    ProjectsStore,
    ProjectsService,
    CurrentProjectStore,
    CurrentProjectService,
    TaskSchemaStore,
    TaskSchemaService,
    PlanPropertyMapStore,
    PlanPropertyMapService,
    PlannerService,
    RunsStore,
    SelectedPlanRunService,
    CurrentRunStore,
    CurrentQuestionStore,
    SelectedQuestionService,
    DomainSpecStore,
    ViewSettingsStore,
    ViewSettingsService,
    DemosStore,
    DemosService,
    RunningDemoStore,
    RunningDemoService,
    UserStudiesStore,
    UserStudiesService,
    RunningUserStudyStore,
    RunningUserStudyService,
    AnimationHandler,
    {provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}},
    PlanVisualizationProvider,
    MatSnackBar,
  ],
  entryComponents: [
    PropertyCreatorComponent,
    ProjectCollectionComponent,
    ProjectCreatorComponent,
    DemoCreatorComponent,
    PropertyCollectionComponent,
    DemoSettingsComponent,
    ViewSettingsMenuComponent,
    RegisterComponent,
    LoginComponent,
    AnimationSettingsNomysteryComponent,
    AnimationsSettingsDemoComponent,
    DemoFinishedComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

