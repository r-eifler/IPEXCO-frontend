import { takeUntil } from "rxjs/operators";
import { Project } from "src/app/interface/project";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Router } from "@angular/router";
import { ProjectCreatorComponent } from "../project-creator/project-creator.component";
import {
  CurrentProjectService,
  ProjectsService,
} from "src/app/service/project/project-services";
import { ResponsiveService } from "src/app/service/responsive/responsive.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { AskDeleteComponent } from "../../utils/ask-delete/ask-delete.component";

@Component({
  selector: "app-project-selection",
  templateUrl: "./project-collection.component.html",
  styleUrls: ["./project-collection.component.scss"],
})
export class ProjectCollectionComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<any> = new Subject();

  projects$: Observable<Project[]>;
  isMobile: boolean;

  constructor(
    private projectService: ProjectsService,
    private currentProjectService: CurrentProjectService,
    private responsiveService: ResponsiveService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.projects$ = projectService.getList();
  }

  ngOnInit(): void {
    this.projectService.findCollection();
    this.responsiveService
      .getMobileStatus()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isMobile) => {
        this.isMobile = isMobile;
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
    dialogConfig.width = "500px";
    // dialogConfig.height = "600px";
    dialogConfig.data = {
      project: null,
    };

    this.dialog.open(ProjectCreatorComponent, dialogConfig);
  }

  copy_project(project: Project): void {
    this.projectService.copyObject(project);
  }

  modify_project(project: Project): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "500px";
    dialogConfig.data = {
      project,
    };

    this.dialog.open(ProjectCreatorComponent, dialogConfig);
  }

  openDeleteDialog(project: Project): void {
    const dialogRef = this.dialog.open(AskDeleteComponent, {
      data: {name: "Delete Project", text: "Are you sure you want to delete project: " + project.name + "?"},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result){
        this.projectService.deleteObject(project);
      }
    });
  }
}
