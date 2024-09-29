import { filter, take, takeUntil } from "rxjs/operators";
import { DemoCreatorComponent } from "../../../components/demo/demo-creator/demo-creator.component";
import { DemosService } from "../../../service/demo/demo-services";
import { PlanRun } from "src/app/interface/run";
import { IterationStepsService } from "../../../service/planner-runs/iteration-steps.service";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ResponsiveService } from "src/app/service/responsive/responsive.service";
import { PlanPropertyMapService } from "src/app/service/plan-properties/plan-property-services";
import { CurrentProjectService, ProjectsService } from "src/app/service/project/project-services";
import { Observable, Subject } from "rxjs";
import { PlanProperty } from "src/app/interface/plan-property/plan-property";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Project } from "../../domain/project";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectProject } from "../../state/project.selector";

@Component({
  selector: "app-project-overview",
  templateUrl: "./project-overview.component.html",
  styleUrls: ["./project-overview.component.css"],
})
export class ProjectOverviewComponent implements OnInit {

  project$: Observable<Project>;
  properties$: Observable<Map<string, PlanProperty>>;

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
    // this.properties$.pipe(take(1)).subscribe(
    //   pp => {
    //     console.log("Create Demo");
    //     if(pp.size == 0){
    //       this.openSnackBar("You need to create at least one plan property before generateing a demo.", "Close")
    //     } else {
    //       let used = 0;
    //       let globalHardGoal = 0
    //       pp.forEach((value, key) => {
    //         if (value.isUsed) {
    //           used++;
    //           if (value.globalHardGoal)
    //             globalHardGoal++;
    //         }
    //       });
    //       if (used == 0) {
    //         this.openSnackBar("You need to select at least one plan property.", "Close")
    //       }
    //       else if (globalHardGoal == 0) {
    //         this.openSnackBar("You need to mark at least one of the selected plan property as global hard-goal.", "Close")
    //       } else{
    //         const dialogConfig = new MatDialogConfig();
    //         dialogConfig.width = "1000px";
    //         dialogConfig.data = {
    //           update: false,
    //           projectId: this.currentProject._id,
    //         };

    //         this.dialog.open(DemoCreatorComponent, dialogConfig);
    //       }
    //     }
    //   }
    // )

  }

  deleteProject(): void {
    // this.projectsService.deleteObject(this.currentProject);
    this.router.navigate(['/projects']);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action);
  }
}
