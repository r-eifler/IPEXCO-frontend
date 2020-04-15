import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import {CdkTableModule} from '@angular/cdk/table';
import { FooterComponent } from './footer/footer.component';

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
import { NavigationComponent } from './navigation/navigation.component';
import { ProjectSelectionComponent } from './components/project/project-selection/project-selection.component';
import { ProjectCreatorComponent } from './components/project/project-creator/project-creator.component';


// editor
import { MonacoEditorModule} from 'ngx-monaco-editor';

// Store
import {PddlFileUtilsService} from './_service/pddl-file-utils.service';
import {
  CurrentProjectStore, CurrentRunStore,
  DomainFilesStore, PlanPropertyCollectionStore,
  ProblemFilesStore,
  ProjectsStore, RunsStore,
  SelectedDomainFileStore,
  SelectedProblemFileStore
} from './store/stores.store';
import {
  DomainFilesService,
  ProblemFilesService,
  SelectedDomainFileService,
  SelectedProblemFileService
} from './_service/pddl-file-services';
import {
  CurrentProjectService,
  RunService,
  PlanPropertyCollectionService,
  ProjectsService,
  CurrentRunService
} from './_service/general-services';
import {PlannerService} from './_service/planner.service';
import { ProjectBaseComponent } from './components/project/project-base/project-base.component';
import { PropertyCollectionComponent } from './components/plan_properties/property-collection/property-collection.component';
import { IterativePlanningBaseComponent } from './components/iterative-planning-base/iterative-planning-base.component';
import { TaskViewComponent } from './components/iter_planning_steps/task-view/task-view.component';
import { PlanViewComponent } from './components/iter_planning_steps/plan-view/plan-view.component';
import { QuestionStepComponent } from './components/iter_planning_steps/question-step/question-step.component';
import { PlanningStepComponent } from './components/iter_planning_steps/planning-step/planning-step.component';
import { FinishedPlanningStepComponent } from './components/iter_planning_steps/finished-planning-step/finished-planning-step.component';
import { FinishedQuestionStepComponent } from './components/iter_planning_steps/finished-question-step/finished-question-step.component';
import { TaskCreatorComponent } from './components/iter_planning_steps/task-creator/task-creator.component';
import { FirstPlanningStepComponent } from './components/iter_planning_steps/first-planning-step/first-planning-step.component';



const appRoutes: Routes = [
  { path: 'projects', component: ProjectSelectionComponent},
  { path: 'project/:projectid', component: ProjectBaseComponent,
    children: [
      { path: 'properties', component: PropertyCollectionComponent},
      { path: 'iterative-planning', component: IterativePlanningBaseComponent,
        children: [
          { path: 'original-task', component: FirstPlanningStepComponent},
          { path: 'planning-step/:runid', component: FinishedPlanningStepComponent},
          { path: 'question-step/:runid', component: FinishedQuestionStepComponent},
          { path: 'new_question', component: QuestionStepComponent},
        ]
      },
    ]
  },
  { path: 'domain-files', component: DomainSelectorComponent},
  { path: 'problem-files', component: ProblemSelectorComponent},
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
    MatProgressSpinnerModule,
    FormsModule,
    MonacoEditorModule.forRoot(),
    MatListModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: false, // <-- debugging purposes only
        paramsInheritanceStrategy: 'always'}
    ),
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
    ProjectsStore,
    ProjectsService,
    CurrentProjectStore,
    CurrentProjectService,
    PlanPropertyCollectionStore,
    PlanPropertyCollectionService,
    PlannerService,
    RunService,
    RunsStore,
    CurrentRunService,
    CurrentRunStore,

  ],
  entryComponents: [
    PropertySelectorComponent,
    PropertyCreatorComponent,
    ProjectSelectionComponent,
    ProjectCreatorComponent,
    PropertyCollectionComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
