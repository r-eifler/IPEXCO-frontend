import { Observable, Subject } from "rxjs";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { IterationStep } from "../../domain/iteration_step";
import { Store } from "@ngrx/store";
import { selectIterativePlanningSelectedStep } from "../../state/iterative-planning.selector";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-iteration-step-detail-navigator",
  templateUrl: "./iteration-step-detail-navigator.component.html",
  styleUrls: ["./iteration-step-detail-navigator.component.scss"],
})
export class IterationStepDetailNavigatorComponent
  implements OnInit
{

  step$: Observable<IterationStep>;
  showTab = 1;

  constructor(
    private store: Store,
  ) {
    this.step$ = this.store.select(selectIterativePlanningSelectedStep);

    this.step$.pipe(takeUntilDestroyed()).subscribe((step) => {
      if (step) {
        this.showTab = 1;
        return;
      }
    });
  }

  ngOnInit(): void {}

}
