import { map, take } from 'rxjs/operators';
import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectExplainer, selectOutputSchemas, selectPlanners, selectProject, selectProjectSettings, selectPrompts, selectServices } from '../../state/project.selector';
import { loadOutputSchemas, loadPrompts, loadServices, updateProject } from '../../state/project.actions';
import { GeneralSettings } from '../../domain/general-settings';
import { AsyncPipe } from '@angular/common';
import { SettingsComponent } from '../../components/settings/settings.component';
import { PlanPropertyTemplate } from 'src/app/shared/domain/plan-property/plan-property-template';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { Project } from 'src/app/shared/domain/project';

@Component({
    selector: 'app-project-settings-container',
    imports: [
        PageModule,
        MatIconModule,
        RouterLink,
        BreadcrumbModule,
        AsyncPipe,
        SettingsComponent,
    ],
    templateUrl: './project-settings-container.component.html',
    styleUrls: ['./project-settings-container.component.scss']
})
export class ProjectSettingsContainerComponent implements OnInit {

  store = inject(Store);
  settings$ = this.store.select(selectProjectSettings);
  project$ = this.store.select(selectProject);
  services$ = this.store.select(selectServices);
  explainer$ = this.store.select(selectExplainer);
  prompts$ = this.store.select(selectPrompts);
  outputSchemas$ = this.store.select(selectOutputSchemas);

  model$ = this.project$.pipe(
    map(p => p?.baseTask?.model)
  )

  constructor(){
    this.store.dispatch(loadServices());
    this.store.dispatch(loadPrompts());
    this.store.dispatch(loadOutputSchemas());
  }


  onSaveSetting(settings: GeneralSettings): void {
    this.project$.pipe(take(1)).subscribe(
      project => {
        let newProject: Project = {
          ...project,
        }
        newProject.settings = settings;
        this.store.dispatch(updateProject({project: newProject}))
      }
    )
  }

  onSaveTemplates(templates: PlanPropertyTemplate[]): void {
    // this.project$.pipe(take(1)).subscribe(
    //   project => {
    //     let newProject: Project = {
    //       ...project,
    //       domainSpecification: {
    //         ...project.domainSpecification,
    //         planPropertyTemplates: templates
    //       }
    //     }
    //     this.store.dispatch(updateProject({project: newProject}))
    //     // this.router.navigate(['/projects', project._id, 'overview'],);
    //   }
    // )
  }

  ngOnInit(): void {
  }

}
