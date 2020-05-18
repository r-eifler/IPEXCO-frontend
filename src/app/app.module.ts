import { ViewSettingsService } from './service/setting.service';
import { SchemaService } from './service/schema.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
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
import {MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, MatBottomSheetModule} from '@angular/material/bottom-sheet';

import {ResizableModule} from 'angular-resizable-element';


// forms
import { ReactiveFormsModule } from '@angular/forms';
import {FormsModule} from '@angular/forms';

// my components
import { TemplatePlanPropertyComponent } from './components/template-plan-property/template-plan-property.component';
import { TemplatePropertyDependencyComponent } from './components/template-property-dependency/template-property-dependency.component';
import { PropertySelectorComponent} from './components/iter_planning_steps/property-selector/property-selector.component';
import { TemplatePddlFileComponent } from './components/files/template-pddl-file/template-pddl-file.component';
import { TemplateFileUploadComponent } from './components/files/template-file-upload/template-file-upload.component';
import { TemplateFileDetailComponent } from './components/files/template-file-detail/template-file-detail.component';
import { DomainSelectorComponent } from './components/files/domain-selector/domain-selector.component';
import { ProblemSelectorComponent } from './components/files/problem-selector/problem-selector.component';
import { PropertyCreatorComponent } from './components/plan_properties/property-creator/property-creator.component';
import { ExplanationProcessComponent } from './components/explanation-process/explanation-process.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ProjectSelectionComponent } from './components/project/project-selection/project-selection.component';
import { ProjectCreatorComponent } from './components/project/project-creator/project-creator.component';
import { PlannerService } from './service/planner.service';
import { ProjectBaseComponent } from './components/project/project-base/project-base.component';
import { PropertyCollectionComponent } from './components/plan_properties/property-collection/property-collection.component';
import { IterativePlanningBaseComponent } from './components/iter_planning_steps/iterative-planning-base/iterative-planning-base.component';
import { TaskViewComponent } from './components/iter_planning_steps/task-view/task-view.component';
import { PlanViewComponent } from './components/iter_planning_steps/plan-view/plan-view.component';
import { QuestionStepComponent } from './components/iter_planning_steps/question-step/question-step.component';
import { PlanningStepComponent } from './components/iter_planning_steps/planning-step/planning-step.component';
import { FinishedPlanningStepComponent } from './components/iter_planning_steps/finished-planning-step/finished-planning-step.component';
import { FinishedQuestionStepComponent } from './components/iter_planning_steps/finished-question-step/finished-question-step.component';
import { TaskCreatorComponent } from './components/iter_planning_steps/task-creator/task-creator.component';
import { FirstPlanningStepComponent } from './components/iter_planning_steps/first-planning-step/first-planning-step.component';
import { QuestionCreatorComponent } from './components/iter_planning_steps/question-creator/question-creator.component';
import { QuestionViewComponent } from './components/iter_planning_steps/question-view/question-view.component';
import { ExplanationViewComponent } from './components/iter_planning_steps/explanation-view/explanation-view.component';


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
  ViewSettingsStore
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
import { DemoSellectionComponent } from './components/demo/demo-sellection/demo-sellection.component';
import { DemoBaseComponent } from './components/demo/demo-base/demo-base.component';
import { MobilMenuComponent } from './components/settings/mobil-menu/mobil-menu.component';
import { DemoSettingsComponent } from './components/demo/demo-settings/demo-settings.component';
import { ProjectOverviewComponent } from './components/project/project-overview/project-overview.component';
import { DomainSpecificationComponent } from './components/files/domain-specification/domain-specification.component';
import { ViewSettingsMenuComponent } from './components/settings/view-settings-menu/view-settings-menu.component';
import { RunTreeComponent } from './components/iter_planning_steps/run-tree/run-tree.component';
import { IterativePlanningBaseMobileComponent }
from './components/iter_planning_steps/mobile/iterative-planning-base-mobile/iterative-planning-base-mobile.component';
import { NomysteryPlanViewComponent } from './components/plugins/nomystery/nomystery-plan-view/nomystery-plan-view.component';
import { NomysteryTaskViewComponent } from './components/plugins/nomystery/nomystery-task-view/nomystery-task-view.component';



const appRoutes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'projects', component: ProjectSelectionComponent},
  { path: 'project/:projectid', component: ProjectBaseComponent,
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
      },
    ]
  },
  { path: 'domain-files', component: DomainSelectorComponent},
  { path: 'problem-files', component: ProblemSelectorComponent},
  { path: 'domain-specification', component: DomainSpecificationComponent},
  { path: 'demos', component: DemoSellectionComponent},
];


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    TemplatePlanPropertyComponent,
    TemplatePropertyDependencyComponent,
    PropertySelectorComponent,
    TemplatePddlFileComponent,
    TemplateFileUploadComponent,
    TemplateFileDetailComponent,
    DomainSelectorComponent,
    ProblemSelectorComponent,
    PropertyCreatorComponent,
    ExplanationProcessComponent,
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
    DemoSellectionComponent,
    DemoBaseComponent,
    MobilMenuComponent,
    DemoSettingsComponent,
    ProjectOverviewComponent,
    DomainSpecificationComponent,
    ViewSettingsMenuComponent,
    RunTreeComponent,
    IterativePlanningBaseMobileComponent,
    NomysteryPlanViewComponent,
    NomysteryTaskViewComponent,
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
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: false, // <-- debugging purposes only
        paramsInheritanceStrategy: 'always'}
    ),
    ResizableModule,
  ],
  providers: [
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
    SchemaService,
    PlanPropertyCollectionStore,
    PlanPropertyCollectionService,
    PlannerService,
    RunService,
    RunsStore,
    CurrentRunService,
    CurrentRunStore,
    CurrentQuestionStore,
    CurrentQuestionService,
    DomainSpecStore,
    ViewSettingsStore,
    ViewSettingsService,
    {provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}},

  ],
  entryComponents: [
    PropertySelectorComponent,
    PropertyCreatorComponent,
    ProjectSelectionComponent,
    ProjectCreatorComponent,
    PropertyCollectionComponent,
    DemoSettingsComponent,
    ViewSettingsMenuComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

