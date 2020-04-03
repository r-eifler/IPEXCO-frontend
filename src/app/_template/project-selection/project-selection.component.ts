import { Component, OnInit } from '@angular/core';
import {Project} from '../../_interface/project';
import {ProjectService} from '../../_service/general-services';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-project-selection',
  templateUrl: './project-selection.component.html',
  styleUrls: ['./project-selection.component.css']
})
export class ProjectSelectionComponent implements OnInit {

  projects$: Observable<Project[]>;

  constructor(private projectService: ProjectService) {
    this.projects$ = projectService.collection$;
  }

  ngOnInit(): void {
    this.projectService.findCollection();
  }

  delete(project): void {
    this.projectService.deleteObject(project);
  }

}
