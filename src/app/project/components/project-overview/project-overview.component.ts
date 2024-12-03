import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { PlanProperty } from "src/app/shared/domain/plan-property/plan-property";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Project } from "../../domain/project";
import { Router, RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectProject } from "../../state/project.selector";
import { MatCardModule } from "@angular/material/card";
import { AsyncPipe } from "@angular/common";
import { MatIcon } from "@angular/material/icon";
import { ProjectActionCardComponent } from "../project-action-card/project-action-card.component";
import { MatButtonModule } from "@angular/material/button";
import { DemoCreatorComponent } from "src/app/project/components/demo-creator/demo-creator.component";
import { ProjectPlanPropertyService } from "../../service/plan-properties.service";

@Component({
  selector: "app-project-overview",
  standalone: true,
  imports: [
    MatCardModule,
    MatIcon,
    AsyncPipe,
    ProjectActionCardComponent,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: "./project-overview.component.html",
  styleUrls: ["./project-overview.component.scss"],
})
export class ProjectOverviewComponent implements OnInit {

  project$: Observable<Project>;
  properties$: Observable<Record<string, PlanProperty>>;

  constructor(
    store: Store,
    public dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // this.properties$ = this.propertiesService.getMap();
    this.project$ = store.select(selectProject)

  }

  ngOnInit(): void {

  }


  createDemo(): void {
    const dialogConfig = new MatDialogConfig();
      dialogConfig.width = "3000px";
      this.dialog.open(DemoCreatorComponent, dialogConfig);
  }

  deleteProject(): void {
    // this.projectsService.deleteObject(this.currentProject);
    this.router.navigate(['/projects']);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action);
  }
}
