import { Component, OnInit } from '@angular/core';
import {Project} from '../../../_interface/project';
import { ProjectsService} from '../../../_service/general-services';
import {Observable} from 'rxjs';
import { Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ProjectCreatorComponent} from '../project-creator/project-creator.component';

@Component({
  selector: 'app-project-selection',
  templateUrl: './project-selection.component.html',
  styleUrls: ['./project-selection.component.css']
})
export class ProjectSelectionComponent implements OnInit {

  projects$: Observable<Project[]>;

  constructor(private projectService: ProjectsService, private router: Router, public dialog: MatDialog) {
    this.projects$ = projectService.collection$;
  }

  ngOnInit(): void {
    this.projectService.findCollection();
  }

  delete(project): void {
    this.projectService.deleteObject(project);
  }

  new_project_form(): void {
    const dialogRef = this.dialog.open(ProjectCreatorComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
