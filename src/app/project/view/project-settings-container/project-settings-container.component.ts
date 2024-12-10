import { map, take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectProject, selectProjectSettings } from '../../state/project.selector';
import { updateProject } from '../../state/project.actions';
import { GeneralSettings } from '../../domain/general-settings';
import { PlanningModel } from 'src/app/shared/domain/planning-task';
import { AsyncPipe } from '@angular/common';
import { PropertyTemplateCreatorComponent } from '../../components/property-template-creator/property-template-creator.component';
import { SettingsComponent } from '../../components/settings/settings.component';
import { PlanPropertyTemplate } from 'src/app/shared/domain/plan-property/plan-property-template';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { Project } from 'src/app/shared/domain/project';

@Component({
  selector: 'app-project-settings-container',
  standalone: true,
  imports: [
    PageModule, 
    MatIconModule,
    RouterLink, 
    BreadcrumbModule,
    AsyncPipe,
    PropertyTemplateCreatorComponent,
    SettingsComponent,
  ],
  templateUrl: './project-settings-container.component.html',
  styleUrls: ['./project-settings-container.component.scss']
})
export class ProjectSettingsContainerComponent implements OnInit {

  settings$: Observable<GeneralSettings>
  project$: Observable<Project>
  model$: Observable<PlanningModel>
  templates$: Observable<PlanPropertyTemplate[]>

  constructor(
    private store: Store
  ) {
    this.settings$ = store.select(selectProjectSettings);
    this.project$ = store.select(selectProject);
    this.templates$ = this.project$.pipe(
      map(p => p?.domainSpecification?.planPropertyTemplates),
      tap(console.log)
    )
    this.model$ = this.project$.pipe(
      map(p => p?.baseTask?.model)
    )
  }

  onSaveSetting(settings: GeneralSettings): void {
    console.log(settings)
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
    console.log(templates)
    this.project$.pipe(take(1)).subscribe(
      project => {
        let newProject: Project = {
          ...project,
          domainSpecification: {
            ...project.domainSpecification,
            planPropertyTemplates: templates
          }
        }
        this.store.dispatch(updateProject({project: newProject}))
        // this.router.navigate(['/projects', project._id, 'overview'],);
      }
    )
  }

  ngOnInit(): void {
  }

}
