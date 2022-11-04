import { ProjectsService } from 'src/app/service/project/project-services';
import { filter, map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CurrentProjectService } from 'src/app/service/project/project-services';
import { Component, OnInit } from '@angular/core';
import { GeneralSettings } from 'src/app/interface/settings/general-settings';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-project-settings-container',
  templateUrl: './project-settings-container.component.html',
  styleUrls: ['./project-settings-container.component.scss']
})
export class ProjectSettingsContainerComponent implements OnInit {

  settings$: Observable<GeneralSettings>

  constructor(
    private currentProjectService: CurrentProjectService,
    private projectsService: ProjectsService,
    private router: Router
  ) {
    this.settings$ = currentProjectService.getSelectedObject().pipe(
      filter(p => !!p),
      map(p => p.settings)
    )
  }

  onSave(settings: GeneralSettings): void {
    this.currentProjectService.getSelectedObject().pipe(take(1)).subscribe(
      project => {
        project.settings = settings;
        this.projectsService.saveObject(project);
        this.router.navigate(['/projects', project._id, 'overview'],);
      }
    )
  }

  ngOnInit(): void {
  }

}
