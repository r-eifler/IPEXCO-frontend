import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

// import { InlineSVGModule } from "ng-inline-svg";
import { CdkTableModule } from "@angular/cdk/table";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ColorPickerModule } from 'ngx-color-picker';
import { AppComponent } from "./app.component";
import { FooterComponent } from "./components/footer/footer.component";


// Material
import { DragDropModule } from "@angular/cdk/drag-drop";
import { LayoutModule } from "@angular/cdk/layout";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatBadgeModule } from "@angular/material/badge";
import {
    MAT_BOTTOM_SHEET_DEFAULT_OPTIONS,
    MatBottomSheetModule,
} from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTreeModule } from "@angular/material/tree";

import { ResizableModule } from "angular-resizable-element";


// forms
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// Store
import {
    CurrentProjectStore,
    CurrentRunStore,
    DemosStore,
    DomainFilesStore,
    DomainSpecStore,
    DomainSpecificationFilesStore,
    FinishedStepInterfaceStatiStore,
    IterationStepsStore,
    MetaStudiesStore,
    NewIterationStepStore,
    NewStepInterfaceStatusStore,
    PlanPropertyMapStore,
    ProblemFilesStore,
    ProjectsStore,
    RunningDemoStore,
    RunningUserStudyStore,
    RunsStore,
    SelectedIterationStepStore,
    SelectedMetaStudyStore,
    TaskSchemaStore,
    UserStore,
    UserStudiesStore,
    UserStudyCurrentDataStore,
    UserStudyDataStore,
} from "./store/stores.store";

// Services
import { IterationStepsService } from "src/app/service/planner-runs/iteration-steps.service";
import { AuthenticationService } from "./service/authentication/authentication.service";
import {
    DomainFilesService,
    ProblemFilesService,
} from "./service/files/pddl-file-services";
import { PddlFileUtilsService } from "./service/files/pddl-file-utils.service";
import { PlanPropertyMapService } from "./service/plan-properties/plan-property-services";
import {
    CurrentProjectService,
    ProjectsService,
} from "./service/project/project-services";
import {
    RunningUserStudyService,
    UserStudiesService,
} from "./service/user-study/user-study-services";

// my components
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { LlmBaseComponent } from './LLM/components/llm-base/llm-base.component';
import { LLMService } from './LLM/service/llm.service';
import { SendMessageToLLMEffect } from './LLM/state/effects/send-message.effect';
import { LLMChatFeature, llmChatReducer } from './LLM/state/llm.reducer';
import { appRoutes } from "./app.routes";
import { DemoBaseComponent } from "./components/demo/demo-base/demo-base.component";
import { DemoCollectionComponent } from "./components/demo/demo-collection/demo-collection.component";
import { DemoCreatorComponent } from "./project/components/demo-creator/demo-creator.component";
import { DemoFinishedComponent } from "./components/demo/demo-finished/demo-finished.component";
import { DemoHelpDialogComponent } from "./components/demo/demo-help-dialog/demo-help-dialog.component";
import { DemoHelpComponent } from "./components/demo/demo-help/demo-help.component";
import { DemoInfoComponent } from "./components/demo/demo-info/demo-info.component";
import { DemoNavigatorComponent } from "./components/demo/demo-navigator/demo-navigator.component";
import { DemoSettingsComponent } from "./components/demo/demo-settings/demo-settings.component";
import { DemoTaskInfoComponent } from "./components/demo/demo-task-info/demo-task-info.component";
import { DemoTaskIntroComponent } from "./components/demo/demo-task-intro/demo-task-intro.component";
import { DomainSelectorComponent } from "./components/files/domain-selector/domain-selector.component";
import { TemplateFileUploadComponent } from "./components/files/file-upload/file-upload.component";
import { FilesCollectionComponent } from "./components/files/files-collection/files-collection.component";
import { ProblemSelectorComponent } from "./components/files/problem-selector/problem-selector.component";
import { HelpPageComponent } from "./components/login/help-page/help-page.component";
import { LoginComponent } from "./components/login/login/login.component";
import { MainInfoComponent } from "./components/login/main-info/main-info.component";
import { MainPageComponent } from "./components/login/main-page/main-page.component";
import { RegisterComponent } from "./components/login/register/register.component";
import { NavigationComponent } from "./components/navigation/navigation.component";
import { CompleteActionComponent } from "./components/planning-task/complete-action/complete-action.component";
import { PlanningTaskViewComponent } from "./components/planning-task/planning-task-view/planning-task-view.component";
import { AcceptedTestPersonsComponent } from "./components/user-study/eval/accepted-test-persons/accepted-test-persons.component";
import { IndividualRunUserDataComponent } from "./components/user-study/eval/individual-run-user-data/individual-run-user-data.component";
import { OverviewDataComponent } from "./components/user-study/eval/overview-data/overview-data.component";
import { TimeLoggerDataComponent } from "./components/user-study/eval/time-logger-data/time-logger-data.component";
import { UserStudyDataBaseComponent } from "./components/user-study/eval/user-study-data-base/user-study-data-base.component";
import { MetaStudyCollectionComponent } from "./components/user-study/meta-study/meta-study-collection/meta-study-collection.component";
import { MetaStudyCreatorComponent } from "./components/user-study/meta-study/meta-study-creator/meta-study-creator.component";
import { StudySelectionRedirectionComponent } from "./components/user-study/meta-study/study-selection-redirection/study-selection-redirection.component";
import { UserStudyBaseComponent } from "./components/user-study/user-study-base/user-study-base.component";
import { UserStudyCollectionBaseComponent } from "./components/user-study/user-study-collection-base/user-study-collection-base.component";
import { UserStudyCollectionComponent } from "./components/user-study/user-study-collection/user-study-collection.component";
import { UserStudyCreatorComponent } from "./components/user-study/user-study-creator/user-study-creator.component";
import { UserStudyDemoViewComponent } from "./components/user-study/user-study-demo-view/user-study-demo-view.component";
import { UserStudyDescriptionViewComponent } from "./components/user-study/user-study-description-view/user-study-description-view.component";
import { UserStudyEndComponent } from "./components/user-study/user-study-end/user-study-end.component";
import { UserStudyExecuteComponent } from "./components/user-study/user-study-execute/user-study-execute.component";
import { UserStudyFormViewComponent } from "./components/user-study/user-study-form-view/user-study-form-view.component";
import { UserStudyNavigationComponent } from "./components/user-study/user-study-navigation/user-study-navigation.component";
import { UserStudyStartComponent } from "./components/user-study/user-study-start/user-study-start.component";
import { UserMainPageComponent } from "./components/user/user-main-page/user-main-page.component";
import { AskDeleteComponent } from "./components/utils/ask-delete/ask-delete.component";
import { IconSelectorComponent } from './components/utils/icon-selector/icon-selector.component';
import { ObjectProgressBarComponent } from "./components/utils/object-progress-bar/object-progress-bar.component";
import { ObjectSliderComponent } from "./components/utils/object-slider/object-slider.component";
import { PaymentBarComponent } from './components/utils/payment-bar/payment-bar.component';
import { ScalableListComponent } from "./components/utils/scalable-list/scalable-list.component";
import { ScoreBarComponent } from "./components/utils/score-bar/score-bar.component";
import { ConflictVisuContainerComponent } from './components/visualization/conflict-visu-container/conflict-visu-container.component';
import { MUGSVisuMainComponent } from './components/visualization/mugs-visu-main/mugs-visu-main.component';
import { AuthenticationInterceptor } from "./interceptor/authentication.interceptor";
import { ScoreViewComponent } from "./iterative_planning/components/finished-step/score-view/score-view.component";
import { GoalListHighlightedComponent } from './iterative_planning/components/goals/goal-list-highlighted/goal-list-highlighted.component';
import { SelectedHardGoalsComponent } from "./iterative_planning/components/goals/goals-list/goals-list.component";
import { HardGoalSelectorComponent } from "./iterative_planning/components/goals/hard-goal-selector/hard-goal-selector.component";
import { ProjectIterativePlanningBaseComponent } from "./iterative_planning/components/iteration-steps-base/iteration-steps-base.component";
import { IterationStepsListComponent } from "./iterative_planning/components/iteration-steps-list/iteration-steps-list.component";
import { IterativePlanningBaseComponent } from './iterative_planning/components/iterative-planning-base/iterative-planning-base.component';
import { NewStepNavigatorComponent } from "./iterative_planning/components/new-step/new-step-navigator/new-step-navigator.component";
import { InteractivePlanViewComponent } from "./iterative_planning/components/plan/interactive-plan-view/interactive-plan-view.component";
import { PropertyCollectionComponent } from './iterative_planning/components/plan_properties/property-collection/property-collection.component';
import { PropertyCreatorComponent } from './iterative_planning/components/plan_properties/property-creator/property-creator.component';
import { ExplainerMonitoringService } from './iterative_planning/service/explainer-monitoring.service';
import { ExplainerService } from './iterative_planning/service/explainer.service';
import { IterationStepService } from './iterative_planning/service/iteration-step.service';
import { PlanPropertyService } from './iterative_planning/service/plan-properties.service';
import { PlannerService } from './iterative_planning/service/planner.service';
import { IterativePlanningProjectService } from './iterative_planning/service/project.service';
import { ComputeExplanationEffect } from './iterative_planning/state/effects/compute-explanation.effect';
import { ComputePlanEffect } from './iterative_planning/state/effects/compute-plan.effect';
import { CreateIterationStepEffect } from './iterative_planning/state/effects/create-iteration-step.effect';
import { CreatePlanPropertyEffect } from './iterative_planning/state/effects/create-plan-property.effect';
import { DeletePlanPropertyEffect } from './iterative_planning/state/effects/delete-plan-property.effect';
import { LoadIterationStepsEffect } from './iterative_planning/state/effects/load-iteration-steps.effect';
import { LoadPlanPropertiesEffect } from './iterative_planning/state/effects/load-plan-properties.effect';
import { LoadIterativePlanningProjectEffect } from './iterative_planning/state/effects/load-project.effect';
import { QuestionQueueEffect } from './iterative_planning/state/effects/question-queue.effect';
import { UpdatePlanPropertyEffect } from './iterative_planning/state/effects/update-plan-property.effect';
import { iterativePlanningFeature, iterativePlanningReducer } from './iterative_planning/state/iterative-planning.reducer';
import { MarkedPipe } from "./pipes/marked.pipe";
import { ProjectCollectionComponent } from "./project-meta/components/project-collection/project-collection.component";
import { ProjectCreatorComponent } from "./project-meta/components/project-creator/project-creator.component";
import { CreateProjectService } from './project-meta/service/create-project.service';
import { ProjectMetaDataService } from './project-meta/service/project-meta-data.service';
import { CreateProjectEffect } from './project-meta/state/effects/create-project.effect';
import { DeleteProjectEffect } from './project-meta/state/effects/delete-project.effect';
import { LoadProjectMetaDataListEffect } from './project-meta/state/effects/load-project-meta-list.effect';
import { projectMetaDataFeature, projectMetaDataReducer } from './project-meta/state/project-meta.reducer';
import { ProjectBaseComponent } from "./project/view/project-base/project-base.component";
import { ProjectSettingsContainerComponent } from './project/components/project-settings-container/project-settings-container.component';
import { PropertyTemplateCreatorComponent } from './project/components/property-template-creator/property-template-creator.component';
import { SettingsComponent } from "./project/components/settings/settings.component";
import { ProjectService } from './project/service/project.service';
import { LoadProjectEffect } from './project/state/effects/load-project.effect';
import { UpdateProjectEffect } from './project/state/effects/update-project.effect';
import { projectFeature, projectReducer } from './project/state/project.reducer';
import {
    FinishedStepInterfaceStatusService,
    NewStepInterfaceStatusService,
} from "./service/user-interface/interface-status-services";
import {
    MetaStudiesService,
    SelectedMetaStudyService,
} from "./service/user-study/meta-study-services";
import { UserStudyCurrentDataService, UserStudyDataService } from "./service/user-study/user-study-data.service";
import { ActionCardModule } from './shared/component/action-card/action-card.module';
import { ChatModule } from './shared/component/chat/chat.module';
import { LabelModule } from './shared/component/label/label.module';
import { PageModule } from './shared/component/page/page.module';
import { ProjectOverviewComponent } from './project/components/project-overview/project-overview.component';
import { DemoService } from './project/service/demo.service';
import { DialogComponent } from "./shared/component/dialog/dialog/dialog.component";
import { DialogModule } from './shared/component/dialog/dialog.module';
import { LoadProjectPlanPropertiesEffect } from './project/state/effects/load-plan-properties.effect';
import { ProjectPlanPropertyService } from './project/service/plan-properties.service';


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
    LoginComponent,
    DemoCollectionComponent,
    DemoBaseComponent,
    DemoSettingsComponent,
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
    SettingsComponent,
    CompleteActionComponent,
    IterationStepsListComponent,
    HardGoalSelectorComponent,
    SelectedHardGoalsComponent,
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
    IterativePlanningBaseComponent,
    GoalListHighlightedComponent,
    LlmBaseComponent
  ],
  imports: [
    StoreModule.forRoot({
        [projectFeature]: projectReducer,
        [projectMetaDataFeature]: projectMetaDataReducer,
        [iterativePlanningFeature]: iterativePlanningReducer,
        [LLMChatFeature]: llmChatReducer
    }),
    EffectsModule.forRoot([
        LoadProjectEffect,
        UpdateProjectEffect,
        LoadProjectPlanPropertiesEffect,
        LoadProjectMetaDataListEffect,
        CreateProjectEffect,
        DeleteProjectEffect,
        LoadIterativePlanningProjectEffect,
        CreatePlanPropertyEffect,
        LoadPlanPropertiesEffect,
        UpdatePlanPropertyEffect,
        DeletePlanPropertyEffect,
        LoadIterationStepsEffect,
        CreateIterationStepEffect,
        ComputePlanEffect,
        SendMessageToLLMEffect,
        ComputeExplanationEffect,
        QuestionQueueEffect,
    ]),
    // Instrumentation must be imported after importing StoreModule (config is optional)
    StoreDevtoolsModule.instrument({
        maxAge: 25, // Retains last 25 states
        autoPause: true, // Pauses recording actions and state changes when the extension window is not open
        trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
        traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
        connectInZone: true // If set to true, the connection is established within the Angular zone
    }),
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
    PageModule,
    ActionCardModule,
    ChatModule,
    LabelModule,
    PropertyTemplateCreatorComponent,
    ProjectOverviewComponent,
    DialogModule
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
    ProjectsStore,
    ProjectsService,
    CurrentProjectStore,
    CurrentProjectService,
    TaskSchemaStore,
    PlanPropertyMapStore,
    PlanPropertyMapService,
    PlannerService,
    RunsStore,
    CurrentRunStore,
    IterationStepsService,
    IterationStepsStore,
    SelectedIterationStepStore,
    NewIterationStepStore,
    DomainSpecStore,
    DemosStore,
    DemoService,
    RunningDemoStore,
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
    // new ngrx
    ProjectService,
    ProjectMetaDataService,
    CreateProjectService,
    IterativePlanningProjectService,
    PlanPropertyService,
    IterationStepService,
    PlannerService,
    LLMService,
    ExplainerService,
    ExplainerMonitoringService,
    ProjectPlanPropertyService,
    {
      provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS,
      useValue: { hasBackdrop: true },
    },
    MatSnackBar,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
