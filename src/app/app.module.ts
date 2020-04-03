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

// forms
import { ReactiveFormsModule } from '@angular/forms';
import {FormsModule} from '@angular/forms';

// my components
import { TemplatePlanPropertyComponent } from './_template/template-plan-property/template-plan-property.component';
import { TemplatePropertyDependencyComponent } from './_template/template-property-dependency/template-property-dependency.component';
import { TemplatePropertySelectorComponent } from './_template/template-property-selecter/template-property-selector.component';
import { TemplatePddlFileComponent } from './_template/template-pddl-file/template-pddl-file.component';
import { TemplateFileUploadComponent } from './_template/template-file-upload/template-file-upload.component';
import { TemplateFileDetailComponent } from './_template/template-file-detail/template-file-detail.component';
import { DomainSelectorComponent } from './_template/domain-selector/domain-selector.component';
import { ProblemSelectorComponent } from './_template/problem-selector/problem-selector.component';
import { PropertyCreatorComponent } from './_template/property-creator/property-creator.component';
import { ExplanationProcessComponent } from './_template/explanation-process/explanation-process.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ProjectSelectionComponent } from './_template/project-selection/project-selection.component';
import { ProjectCreatorComponent } from './_template/project-creator/project-creator.component';


// editor
import { MonacoEditorModule} from 'ngx-monaco-editor';

// Store
import {FileContentService} from './_service/file-content.service';
import {DomainFilesStore, ProblemFilesStore, ProjectStore, SelectedDomainFileStore, SelectedProblemFileStore} from './store/stores.store';
import {
  DomainFilesService,
  ProblemFilesService,
  SelectedDomainFileService,
  SelectedProblemFileService
} from './_service/pddl-file-services';
import {ProjectService} from './_service/general-services';


const appRoutes: Routes = [
  { path: 'projects', component: ProjectSelectionComponent },
  { path: 'explanation-process', component: ExplanationProcessComponent },
];


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    TemplatePlanPropertyComponent,
    TemplatePropertyDependencyComponent,
    TemplatePropertySelectorComponent,
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
        FormsModule,
        MonacoEditorModule.forRoot(),
        MatListModule,
        ReactiveFormsModule,
        RouterModule.forRoot(
          appRoutes,
          { enableTracing: false } // <-- debugging purposes only
        )
    ],
  providers: [
    DomainFilesStore,
    SelectedDomainFileStore,
    ProblemFilesStore,
    SelectedProblemFileStore,
    FileContentService,
    DomainFilesService,
    SelectedDomainFileService,
    ProblemFilesService,
    SelectedProblemFileService,
    ProjectStore,
    ProjectService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
