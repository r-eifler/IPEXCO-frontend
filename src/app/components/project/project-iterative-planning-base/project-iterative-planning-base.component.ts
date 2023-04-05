import { NewIterationStepStoreService } from "./../../../service/planner-runs/selected-iteration-step.service";
import { SelectedIterationStepService } from "src/app/service/planner-runs/selected-iteration-step.service";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { IterationStep } from "../../../interface/run";
import { IterationStepsService } from "../../../service/planner-runs/iteration-steps.service";
import { DemoHelpDialogComponent } from "../../demo/demo-help-dialog/demo-help-dialog.component";
import { Subject, Observable } from "rxjs";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

@Component({
  selector: "app-project-iterative-planning-base",
  templateUrl: "./project-iterative-planning-base.component.html",
  styleUrls: ["./project-iterative-planning-base.component.css"],
})
export class ProjectIterativePlanningBaseComponent
  implements OnInit, OnDestroy
{
  private ngUnsubscribe$: Subject<any> = new Subject();

  step$: Observable<IterationStep>;
  newStep$: Observable<IterationStep>;

  constructor(
    public iterationStepService: IterationStepsService,
    private selectedIterationStepService: SelectedIterationStepService,
    private newIterationStepStoreService: NewIterationStepStoreService,
    public dialog: MatDialog
  ) {
    this.step$ = this.selectedIterationStepService.getSelectedObject();
    this.newStep$ = this.newIterationStepStoreService.getSelectedObject();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    // clearInterval(this.timerIntervall);
  }

  showHelp() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "80%";
    dialogConfig.height = "80%";
    dialogConfig.data = {};

    const dialogRef = this.dialog.open(DemoHelpDialogComponent, dialogConfig);
  }
}
