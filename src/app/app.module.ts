import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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

// editor
import { MonacoEditorModule} from 'ngx-monaco-editor';

// Store
import {DomainFilesService} from './_service/domain-files.service';
import {SelectedDomainFileService} from './_service/selected-domain-file.service';
import { PddlFileEditorComponent } from './_template/pddl-file-editor/pddl-file-editor.component';
import {DomainFilesStore, SelectedDomainFileStore} from './store/stores.store';


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
    PddlFileEditorComponent
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
        FormsModule,
        MonacoEditorModule.forRoot(),
        MatListModule,
        ReactiveFormsModule,
    ],
  providers: [
    DomainFilesStore,
    DomainFilesService,
    SelectedDomainFileStore,
    SelectedDomainFileService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
