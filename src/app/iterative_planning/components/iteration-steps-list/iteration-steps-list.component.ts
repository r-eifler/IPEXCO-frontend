import { MatSelectionListChange } from "@angular/material/list";
import { Component, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Store } from "@ngrx/store";
import { selectIterativePlanningIterationSteps, selectIterativePlanningNewStep, selectIterativePlanningSelectedStep } from "../../state/iterative-planning.selector";
import { deselectIterationStep, initNewIterationStep, selectIterationStep, selectNewIterationStep } from "../../state/iterative-planning.actions";
import { IterationStep, StepStatus } from "../../domain/iteration_step";
import { PlanRunStatus } from "../../domain/plan";
import { map } from "rxjs/operators";

@Component({
  selector: "app-iteration-steps-list",
  templateUrl: "./iteration-steps-list.component.html",
  styleUrls: ["./iteration-steps-list.component.scss"],
})
export class IterationStepsListComponent implements OnInit {
  private unsubscribe$: Subject<any> = new Subject();

  steps$: Observable<IterationStep[]>;
  newStep$: Observable<IterationStep>;
  hasPendingStepCreation$: Observable<boolean>;
  selected$: Observable<IterationStep>;
  hasPlan$: Observable<boolean>;

  constructor(
    private store: Store,
  ) {
    this.steps$ = store.select(selectIterativePlanningIterationSteps)
    this.newStep$ = store.select(selectIterativePlanningNewStep);
    this.hasPendingStepCreation$ = this.newStep$.pipe(map(step => !!step))
    this.selected$ = store.select(selectIterativePlanningSelectedStep)
  }

  ngOnInit(): void {}


  selectStep(event: MatSelectionListChange): void {
    let step = event.options[0].value as IterationStep;
    this.store.dispatch(selectIterationStep({iterationStep: step}))
  }

  selectNewStep() {
    this.store.dispatch(selectNewIterationStep())
  }

  newStep() {
    this.store.dispatch(initNewIterationStep())
  }

  deleteStep(step: IterationStep): void {
    // this.iterationStepsService.deleteObject(step);
  }

  hasPlan(step: IterationStep): boolean {
    return !!step.plan && step.plan.status == PlanRunStatus.plan_found;
  }

  notSolvable(step: IterationStep): boolean {
    return (
      step.status == StepStatus.unsolvable ||
      (step.plan && step.plan.status == PlanRunStatus.not_solvable)
    );
  }

  hasError(step: IterationStep): boolean {
    return step.plan && step.plan.status == PlanRunStatus.failed;
  }

  isPending(step: IterationStep): boolean {
    return step.plan && step.plan.status == PlanRunStatus.pending;
  }
}
