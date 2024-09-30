import { BehaviorSubject, Subject } from "rxjs";
import { SelectedIterationStepService } from "../../../service/planner-runs/selected-iteration-step.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { IterationStep } from "../../domain/run";

@Component({
  selector: "app-iteration-step-detail-navigator",
  templateUrl: "./iteration-step-detail-navigator.component.html",
  styleUrls: ["./iteration-step-detail-navigator.component.scss"],
})
export class IterationStepDetailNavigatorComponent
  implements OnInit, OnDestroy
{
  private unsubscribe$: Subject<any> = new Subject();

  step$: BehaviorSubject<IterationStep>;
  showTab = 1;

  constructor(
    private selectedIterationStepService: SelectedIterationStepService
  ) {
    this.step$ = selectedIterationStepService.getSelectedObject();

    this.step$.pipe(takeUntil(this.unsubscribe$)).subscribe((step) => {
      if (step) {
        this.showTab = 1;
        return;
      }
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
