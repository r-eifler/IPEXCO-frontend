import { Component, DestroyRef, inject, OnDestroy, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { filter, map, take, tap } from "rxjs/operators";
import { IterationStep, StepStatus } from "src/app/iterative_planning/domain/iteration_step";
import { PlanRunStatus } from "src/app/iterative_planning/domain/plan";
import { selectIterativePlanningSelectedStep } from "src/app/iterative_planning/state/iterative-planning.selector";
import { MatCardModule } from "@angular/material/card";
import { AsyncPipe } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { Action } from "src/app/shared/domain/plan-property/plan-property";


@Component({
    selector: "app-plan-view",
    imports: [
    MatCardModule,
    AsyncPipe,
    MatButtonModule
],
    templateUrl: "./plan-view.component.html",
    styleUrls: ["./plan-view.component.scss"]
})
export class PlanViewComponent {

  store = inject(Store);

  step$ = this.store.select(selectIterativePlanningSelectedStep);
 
  actions$ = this.step$.pipe(
    filter((step) => !!step && !!step.plan && step.plan.status == PlanRunStatus.SOLVED),
    map((step) => step?.plan?.actions)
  );

  solved$ = this.step$.pipe(
    filter((step) => !!step && !!step.plan),
    map((step) => step?.plan?.status == PlanRunStatus.SOLVED),
  );

  notSolvable$ = this.step$.pipe(
    filter((step) => !!step),
    map((step) => step.status == StepStatus.UNSOLVABLE),
  );

  isRunning$ = this.step$.pipe(
    filter((step) => !!step && !!step.plan),
    map((step) => step?.plan?.status == PlanRunStatus.PENDING),
  );

  hasPlan$ = this.step$.pipe(
    filter((step) => !!step),
    map((step) => !!step.plan),
  );


}
