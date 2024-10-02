import { Component, OnDestroy, OnInit } from "@angular/core";
import { DemoHelpDialogComponent } from "../../../components/demo/demo-help-dialog/demo-help-dialog.component";
import { Subject, Observable } from "rxjs";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { IterationStep } from "../../domain/iteration_step";
import { Store } from "@ngrx/store";
import { selectIterativePlanningNewStep, selectIterativePlanningSelectedStep } from "../../state/iterative-planning.selector";
import { map } from "rxjs/operators";

@Component({
  selector: "app-iteration-steps-base",
  templateUrl: "./iteration-steps-base.component.html",
  styleUrls: ["./iteration-steps-base.component.css"],
})
export class ProjectIterativePlanningBaseComponent
  implements OnInit
{

  step$: Observable<IterationStep>;
  stepSelected$: Observable<boolean>;
  newStep$: Observable<IterationStep>;

  constructor(
    private store: Store,
    public dialog: MatDialog
  ) {
    this.step$ = this.store.select(selectIterativePlanningSelectedStep);
    this.stepSelected$ = this.step$.pipe(map(s => !!s));
    this.newStep$ = this.store.select(selectIterativePlanningNewStep);
  }

  ngOnInit(): void {}

  showHelp() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "80%";
    dialogConfig.height = "80%";
    dialogConfig.data = {};

    const dialogRef = this.dialog.open(DemoHelpDialogComponent, dialogConfig);
  }
}
