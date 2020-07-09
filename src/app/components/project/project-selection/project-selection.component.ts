import {takeUntil} from 'rxjs/operators';
import {Project} from 'src/app/interface/project';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ProjectCreatorComponent} from '../project-creator/project-creator.component';
import {CurrentProjectService, ProjectsService} from 'src/app/service/project-services';
import {ResponsiveService} from 'src/app/service/responsive.service';

@Component({
  selector: 'app-project-selection',
  templateUrl: './project-selection.component.html',
  styleUrls: ['./project-selection.component.scss']
})
export class ProjectSelectionComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  projects$: Observable<Project[]>;
  isMobile: boolean;

  constructor(
    private projectService: ProjectsService,
    private currentProjectService: CurrentProjectService,
    private responsiveService: ResponsiveService,
    private router: Router,
    public dialog: MatDialog) {

    this.projects$ = projectService.getList();
  }

  ngOnInit(): void {
    this.projectService.findCollection();
    this.responsiveService.getMobileStatus()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( isMobile => {
      if (isMobile) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
    this.responsiveService.checkWidth();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  delete(project: Project): void {
    this.projectService.deleteObject(project);
  }

  new_project_form(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.data  = {
      project: null,
    };

    const dialogRef = this.dialog.open(ProjectCreatorComponent, dialogConfig);

    dialogRef.afterClosed()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
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
    };

    const dialogRef = this.dialog.open(ProjectCreatorComponent, dialogConfig);

    dialogRef.afterClosed()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
