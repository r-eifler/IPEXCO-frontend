import { ProjectsService } from 'src/app/service/project/project-services';
import { filter, map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CurrentProjectService } from 'src/app/service/project/project-services';
import { Component, OnInit } from '@angular/core';
import { GeneralSettings } from 'src/app/interface/settings/general-settings';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectProject, selectProjectSettings } from '../../state/project.selector';
import { Project } from '../../domain/project';
import { updateProject } from '../../state/project.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-project-settings-container',
  templateUrl: './project-settings-container.component.html',
  styleUrls: ['./project-settings-container.component.scss']
})
export class ProjectSettingsContainerComponent implements OnInit {

  settings$: Observable<GeneralSettings>
  project$: Observable<Project>

  constructor(
    private store: Store,
    private router: Router
  ) {
    this.settings$ = store.select(selectProjectSettings);
    this.project$ = store.select(selectProject);
  }

  onSave(settings: GeneralSettings): void {

    this.project$.pipe(take(1)).subscribe(
      project => {
        let newProject = {
          ...project,
          settings
        }
        this.store.dispatch(updateProject({project: newProject}))
        // this.router.navigate(['/projects', project._id, 'overview'],);
      }
    )
  }

  ngOnInit(): void {
  }

}
