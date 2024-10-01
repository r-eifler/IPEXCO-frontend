import { Observable, Subject } from "rxjs";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { IterationStep } from "../../domain/iteration_step";
import { Store } from "@ngrx/store";
import { selectIterativePlanningSelectedStep } from "../../state/iterative-planning.selector";

@Component({
  selector: "app-iteration-step-detail-navigator",
  templateUrl: "./iteration-step-detail-navigator.component.html",
  styleUrls: ["./iteration-step-detail-navigator.component.scss"],
})
export class IterationStepDetailNavigatorComponent
  implements OnInit, OnDestroy
{
  private unsubscribe$: Subject<any> = new Subject();

  step$: Observable<IterationStep>;
  showTab = 1;

  constructor(
    private store: Store,
  ) {
    this.step$ = this.store.select(selectIterativePlanningSelectedStep);

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
