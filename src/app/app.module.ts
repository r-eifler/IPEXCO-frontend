import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

// import { InlineSVGModule } from "ng-inline-svg";
import { ColorPickerModule } from 'ngx-color-picker';
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { CdkTableModule } from "@angular/cdk/table";
import { FooterComponent } from "./components/footer/footer.component";


// Material
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { LayoutModule } from "@angular/cdk/layout";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatStepperModule } from "@angular/material/stepper";
import { MatDividerModule } from "@angular/material/divider";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTreeModule } from "@angular/material/tree";
import { MatBadgeModule } from "@angular/material/badge";
import { MatCardModule } from "@angular/material/card";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTabsModule } from "@angular/material/tabs";
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatListModule } from "@angular/material/list";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import {
  MAT_BOTTOM_SHEET_DEFAULT_OPTIONS,
  MatBottomSheetModule,
} from "@angular/material/bottom-sheet";

import { ResizableModule } from "angular-resizable-element";


// forms
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// Store
import {
  SelectedIterationStepStore,
  CurrentProjectStore,
  CurrentQuestionStore,
  CurrentRunStore,
  DemosStore,
  DomainFilesStore,
  DomainSpecificationFilesStore,
  DomainSpecStore,
  IterationStepsStore,
  MetaStudiesStore,
  PlanningTaskRelaxationsStore,
  PlanPropertyMapStore,
  ProblemFilesStore,
  ProjectsStore,
  RunningDemoStore,
  RunningUserStudyStore,
  RunsStore,
  SelectedMetaStudyStore,
  TaskSchemaStore,
  UserStore,
  UserStudiesStore,
  NewIterationStepStore,
  NewStepInterfaceStatusStore,
  FinishedStepInterfaceStatiStore,
  UserStudyCurrentDataStore,
  UserStudyDataStore,
} from "./store/stores.store";

// Services
import {
  DomainFilesService,
  DomainSpecificationFilesService,
  ProblemFilesService,
} from "./service/files/pddl-file-services";
import {
  CurrentProjectService,
  ProjectsService,
} from "./service/project/project-services";
import { PlanPropertyMapService } from "./service/plan-properties/plan-property-services";
import {
  RunningUserStudyService,
  UserStudiesService,
} from "./service/user-study/user-study-services";
import { PddlFileUtilsService } from "./service/files/pddl-file-utils.service";
import {
  SelectedIterationStepService,
  NewIterationStepStoreService,
} from "./service/planner-runs/selected-iteration-step.service";
import { IterationStepsService } from "src/app/service/planner-runs/iteration-steps.service";
import { PlanningTaskRelaxationService } from "./service/planning-task/planning-task-relaxations-services";
import { AuthenticationService } from "./service/authentication/authentication.service";
import { DemosService, RunningDemoService } from "./service/demo/demo-services";

// my components
import { TemplateFileUploadComponent } from "./components/files/file-upload/file-upload.component";
import { DomainSelectorComponent } from "./components/files/domain-selector/domain-selector.component";
import { ProblemSelectorComponent } from "./components/files/problem-selector/problem-selector.component";
import { PropertyCreatorComponent } from "./components/plan_properties/property-creator/property-creator.component";
import { NavigationComponent } from "./components/navigation/navigation.component";
import { ProjectCollectionComponent } from "./components/project/project-collection/project-collection.component";
import { ProjectCreatorComponent } from "./components/project/project-creator/project-creator.component";
import { PlannerService } from "./service/planner-runs/planner.service";
import { ProjectBaseComponent } from "./components/project/project-base/project-base.component";
import { PropertyCollectionComponent } from "./components/plan_properties/property-collection/property-collection.component";
import { ProjectIterativePlanningBaseComponent } from "./components/project/project-iterative-planning-base/project-iterative-planning-base.component";
import { PlanViewComponent } from "./components/iter-planning/plan/plan-view/plan-view.component";
import { LoginComponent } from "./components/login/login/login.component";
import { DemoCollectionComponent } from "./components/demo/demo-collection/demo-collection.component";
import { DemoBaseComponent } from "./components/demo/demo-base/demo-base.component";
import { DemoSettingsComponent } from "./components/demo/demo-settings/demo-settings.component";
import { ProjectOverviewComponent } from "./components/project/project-overview/project-overview.component";
import { DomainSpecificationComponent } from "./components/files/domain-specification/domain-specification.component";
import { DemoCreatorComponent } from "./components/demo/demo-creator/demo-creator.component";
import { DemoHelpComponent } from "./components/demo/demo-help/demo-help.component";
import { DemoNavigatorComponent } from "./components/demo/demo-navigator/demo-navigator.component";
import { MainPageComponent } from "./components/login/main-page/main-page.component";
import { RegisterComponent } from "./components/login/register/register.component";
import { AuthenticationInterceptor } from "./interceptor/authentication.interceptor";
import { UserMainPageComponent } from "./components/user/user-main-page/user-main-page.component";
import { FilesCollectionComponent } from "./components/files/files-collection/files-collection.component";
import { MainInfoComponent } from "./components/login/main-info/main-info.component";
import { appRoutes } from "./app.routes";
import { HelpPageComponent } from "./components/login/help-page/help-page.component";
import { DemoFinishedComponent } from "./components/demo/demo-finished/demo-finished.component";
import { DemoTaskIntroComponent } from "./components/demo/demo-task-intro/demo-task-intro.component";
import { UserStudyCollectionComponent } from "./components/user-study/user-study-collection/user-study-collection.component";
import { UserStudyCreatorComponent } from "./components/user-study/user-study-creator/user-study-creator.component";
import { UserStudyBaseComponent } from "./components/user-study/user-study-base/user-study-base.component";
import { UserStudyDescriptionViewComponent } from "./components/user-study/user-study-description-view/user-study-description-view.component";
import { UserStudyFormViewComponent } from "./components/user-study/user-study-form-view/user-study-form-view.component";
import { UserStudyDemoViewComponent } from "./components/user-study/user-study-demo-view/user-study-demo-view.component";
import { UserStudyStartComponent } from "./components/user-study/user-study-start/user-study-start.component";
import { UserStudyExecuteComponent } from "./components/user-study/user-study-execute/user-study-execute.component";
import { UserStudyEndComponent } from "./components/user-study/user-study-end/user-study-end.component";
import { SelectedQuestionService } from "./service/planner-runs/selected-question.service";
import { MarkedPipe } from "./pipes/marked.pipe";
import { DemoHelpDialogComponent } from "./components/demo/demo-help-dialog/demo-help-dialog.component";
import { ScalableListComponent } from "./components/utils/scalable-list/scalable-list.component";
import { UserStudyNavigationComponent } from "./components/user-study/user-study-navigation/user-study-navigation.component";
import { UserStudyDataBaseComponent } from "./components/user-study/eval/user-study-data-base/user-study-data-base.component";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { OverviewDataComponent } from "./components/user-study/eval/overview-data/overview-data.component";
import { TimeLoggerDataComponent } from "./components/user-study/eval/time-logger-data/time-logger-data.component";
import { IndividualRunUserDataComponent } from "./components/user-study/eval/individual-run-user-data/individual-run-user-data.component";
import { DemoInfoComponent } from "./components/demo/demo-info/demo-info.component";
import { DemoTaskInfoComponent } from "./components/demo/demo-task-info/demo-task-info.component";
import { MetaStudyCollectionComponent } from "./components/user-study/meta-study/meta-study-collection/meta-study-collection.component";
import { MetaStudyCreatorComponent } from "./components/user-study/meta-study/meta-study-creator/meta-study-creator.component";
import {
  MetaStudiesService,
  SelectedMetaStudyService,
} from "./service/user-study/meta-study-services";
import { StudySelectionRedirectionComponent } from "./components/user-study/meta-study/study-selection-redirection/study-selection-redirection.component";
import { UserStudyCollectionBaseComponent } from "./components/user-study/user-study-collection-base/user-study-collection-base.component";
import { AcceptedTestPersonsComponent } from "./components/user-study/eval/accepted-test-persons/accepted-test-persons.component";
import { InteractivePlanViewComponent } from "./components/iter-planning/plan/interactive-plan-view/interactive-plan-view.component";
import { PlanningTaskViewComponent } from "./components/planning-task/planning-task-view/planning-task-view.component";
import { PlanningTaskRelaxationsComponent } from "./components/planning-task/planning-task-relaxations/planning-task-relaxations.component";
import { SettingsComponent } from "./components/project/settings/settings.component";
import { CompleteActionComponent } from "./components/planning-task/complete-action/complete-action.component";
import { PlanningTaskRelaxationCreatorComponent } from "./components/planning-task/planning-task-relaxation-creator/planning-task-relaxation-creator.component";
import { IterationStepsListComponent } from "./components/iter-planning/iteration-steps-list/iteration-steps-list.component";
import { IterationStepOverviewComponent } from "./components/iter-planning/finished-step/iteration-step-overview/iteration-step-overview.component";
import { IterationStepDetailNavigatorComponent } from "./components/iter-planning/iteration-step-detail-navigator/iteration-step-detail-navigator.component";
import { HardGoalSelectorComponent } from "./components/iter-planning/goals/hard-goal-selector/hard-goal-selector.component";
import { RelaxationSelectorComponent } from "./components/iter-planning/relaxations/relaxation-selector/relaxation-selector.component";
import { SelectedHardGoalsComponent } from "./components/iter-planning/goals/selected-hard-goals/selected-hard-goals.component";
import { ConflictViewComponent } from "./components/iter-planning/explanations/conflict-view/conflict-view.component";
import { FinishedStepNavigatorComponent } from "./components/iter-planning/finished-step/finished-step-navigator/finished-step-navigator.component";
import { SelectedRelaxationsViewComponent } from "./components/iter-planning/relaxations/selected-relaxations-view/selected-relaxations-view.component";
import { ExplanationsViewComponent } from "./components/iter-planning/explanations/explanations-view/explanations-view.component";
import { ExplanationsSelectPreferenceViewComponent } from "./components/iter-planning/explanations/explanations-select-preference-view/explanations-select-preference-view.component";
import { ExplanationsRelaxationsViewComponent } from "./components/iter-planning/explanations/explanations-relaxations-view/explanations-relaxations-view.component";
import { NewStepNavigatorComponent } from "./components/iter-planning/new-step/new-step-navigator/new-step-navigator.component";
import { ObjectSliderComponent } from "./components/utils/object-slider/object-slider.component";
import { ObjectProgressBarComponent } from "./components/utils/object-progress-bar/object-progress-bar.component";
import { ScoreViewComponent } from "./components/iter-planning/finished-step/score-view/score-view.component";
import { ScoreBarComponent } from "./components/utils/score-bar/score-bar.component";
import {
  FinishedStepInterfaceStatusService,
  NewStepInterfaceStatusService,
} from "./service/user-interface/interface-status-services";
import { PaymentBarComponent } from './components/utils/payment-bar/payment-bar.component';
import { UserStudyCurrentDataService, UserStudyDataService } from "./service/user-study/user-study-data.service";
import { ConflictVisuContainerComponent } from './components/visualization/conflict-visu-container/conflict-visu-container.component';
import { MUGSVisuMainComponent } from './components/visualization/mugs-visu-main/mugs-visu-main.component';
import { IconSelectorComponent } from './components/utils/icon-selector/icon-selector.component';
import { ProjectSettingsContainerComponent } from './components/project/project-settings-container/project-settings-container.component';
import { AskDeleteComponent } from "./components/utils/ask-delete/ask-delete.component";



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
    ProjectIterativePlanningBaseComponent,
    PlanViewComponent,
    LoginComponent,
    DemoCollectionComponent,
    DemoBaseComponent,
    DemoSettingsComponent,
    ProjectOverviewComponent,
    DomainSpecificationComponent,
    PlanViewComponent,
    DemoCreatorComponent,
    DemoHelpComponent,
    DemoNavigatorComponent,
    MainPageComponent,
    RegisterComponent,
    UserMainPageComponent,
    FilesCollectionComponent,
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
    UserStudyNavigationComponent,
    UserStudyDataBaseComponent,
    OverviewDataComponent,
    TimeLoggerDataComponent,
    IndividualRunUserDataComponent,
    DemoInfoComponent,
    DemoTaskInfoComponent,
    MetaStudyCollectionComponent,
    MetaStudyCreatorComponent,
    StudySelectionRedirectionComponent,
    UserStudyCollectionBaseComponent,
    AcceptedTestPersonsComponent,
    InteractivePlanViewComponent,
    PlanningTaskViewComponent,
    PlanningTaskRelaxationsComponent,
    SettingsComponent,
    CompleteActionComponent,
    PlanningTaskRelaxationCreatorComponent,
    IterationStepsListComponent,
    IterationStepOverviewComponent,
    IterationStepDetailNavigatorComponent,
    HardGoalSelectorComponent,
    RelaxationSelectorComponent,
    SelectedHardGoalsComponent,
    ConflictViewComponent,
    FinishedStepNavigatorComponent,
    SelectedRelaxationsViewComponent,
    ExplanationsViewComponent,
    ExplanationsSelectPreferenceViewComponent,
    ExplanationsRelaxationsViewComponent,
    NewStepNavigatorComponent,
    ObjectSliderComponent,
    ObjectProgressBarComponent,
    ScoreViewComponent,
    ScoreBarComponent,
    PaymentBarComponent,
    ConflictVisuContainerComponent,
    MUGSVisuMainComponent,
    IconSelectorComponent,
    AskDeleteComponent,
    ProjectSettingsContainerComponent,
  ],
  imports: [
    RouterModule.forRoot(appRoutes, {
      enableTracing: false,
      paramsInheritanceStrategy: "always",
    }),
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
    // InlineSVGModule.forRoot(),
    NgxChartsModule,
    MatTooltipModule,
    ColorPickerModule,
  ],
  providers: [
    UserStore,
    AuthenticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true,
    },
    AuthenticationInterceptor,
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
    PlanPropertyMapStore,
    PlanPropertyMapService,
    PlanningTaskRelaxationService,
    PlanningTaskRelaxationsStore,
    PlannerService,
    RunsStore,
    CurrentRunStore,
    CurrentQuestionStore,
    SelectedQuestionService,
    IterationStepsService,
    IterationStepsStore,
    SelectedIterationStepStore,
    SelectedIterationStepService,
    NewIterationStepStore,
    NewIterationStepStoreService,
    DomainSpecStore,
    DemosStore,
    DemosService,
    RunningDemoStore,
    RunningDemoService,
    UserStudiesStore,
    UserStudiesService,
    RunningUserStudyStore,
    RunningUserStudyService,
    MetaStudiesService,
    MetaStudiesStore,
    SelectedMetaStudyService,
    SelectedMetaStudyStore,
    FinishedStepInterfaceStatiStore,
    FinishedStepInterfaceStatusService,
    NewStepInterfaceStatusStore,
    NewStepInterfaceStatusService,
    UserStudyCurrentDataService,
    UserStudyCurrentDataStore,
    UserStudyDataService,
    UserStudyDataStore,
    {
      provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS,
      useValue: { hasBackdrop: true },
    },
    MatSnackBar,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
