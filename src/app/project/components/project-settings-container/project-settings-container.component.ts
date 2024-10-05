import { map, take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { GeneralSettings } from 'src/app/interface/settings/general-settings';
import { Store } from '@ngrx/store';
import { selectProject, selectProjectSettings } from '../../state/project.selector';
import { Project } from '../../domain/project';
import { updateProject } from '../../state/project.actions';
import { PlanPropertyTemplate } from 'src/app/iterative_planning/domain/plan-property/plan-property-template';

@Component({
  selector: 'app-project-settings-container',
  templateUrl: './project-settings-container.component.html',
  styleUrls: ['./project-settings-container.component.scss']
})
export class ProjectSettingsContainerComponent implements OnInit {

  settings$: Observable<GeneralSettings>
  project$: Observable<Project>
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
  }

  onSaveSetting(settings: GeneralSettings): void {
    console.log(settings)
    this.project$.pipe(take(1)).subscribe(
      project => {
        let newProject: Project = {
          ...project,
          settings
        }
        this.store.dispatch(updateProject({project: newProject}))
        // this.router.navigate(['/projects', project._id, 'overview'],);
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
