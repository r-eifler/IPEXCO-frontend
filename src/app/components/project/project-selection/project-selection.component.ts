import { Project } from './../../../interface/project';
import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import { Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ProjectCreatorComponent} from '../project-creator/project-creator.component';
import { ProjectsService, CurrentProjectService } from 'src/app/service/project-services';

@Component({
  selector: 'app-project-selection',
  templateUrl: './project-selection.component.html',
  styleUrls: ['./project-selection.component.css']
})
export class ProjectSelectionComponent implements OnInit {

  projects$: Observable<Project[]>;

  constructor(
    private projectService: ProjectsService,
    private currentProjectService: CurrentProjectService,
    private router: Router,
    public dialog: MatDialog) {

    this.projects$ = projectService.collection$;
  }

  ngOnInit(): void {
    this.projectService.findCollection();
  }

  delete(project): void {
    this.projectService.deleteObject(project);
  }

  new_project_form(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.data  = {
      project: null,
    }

    const dialogRef = this.dialog.open(ProjectCreatorComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  copy_project(project: Project): void {
    this.projectService.copyObject(project);
  }

  modify_project(project: Project): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.data  = {
      project,
    }

    const dialogRef = this.dialog.open(ProjectCreatorComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
