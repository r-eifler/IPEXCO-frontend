import { NewIterationStepGenerationService } from "../../../service/planner-runs/new-iteration-step-generation-service.service";
import { RunStatus, StepStatus } from "src/app/interface/run";
import { MatSelectionListChange } from "@angular/material/list";
import { IterationStep, ModIterationStep } from "./../../../interface/run";
import {
  SelectedIterationStepService,
  NewIterationStepStoreService,
} from "./../../../service/planner-runs/selected-iteration-step.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { IterationStepsService } from "src/app/service/planner-runs/iteration-steps.service";
import { Observable, BehaviorSubject, Subject } from "rxjs";

@Component({
  selector: "app-iteration-steps-list",
  templateUrl: "./iteration-steps-list.component.html",
  styleUrls: ["./iteration-steps-list.component.scss"],
})
export class IterationStepsListComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<any> = new Subject();

  steps$: BehaviorSubject<IterationStep[]>;
  newStep$: BehaviorSubject<IterationStep>;
  selected$: BehaviorSubject<IterationStep>;
  hasPlan$: Observable<boolean>;

  constructor(
    private iterationStepsService: IterationStepsService,
    private selectedIterationStepService: SelectedIterationStepService,
    private newIterationStepStoreService: NewIterationStepStoreService,
    private newIterationStepGenerationService: NewIterationStepGenerationService
  ) {
    this.steps$ = iterationStepsService.getList();
    this.newStep$ = newIterationStepStoreService.getSelectedObject();
    this.selected$ = selectedIterationStepService.getSelectedObject();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  selectStep(event: MatSelectionListChange): void {
    let step = event.options[0].value as IterationStep;
    this.selectedIterationStepService.saveObject(step);
  }

  selectNewStep() {
    this.selectedIterationStepService.removeCurrentObject();
  }

  newStep() {
    this.newIterationStepGenerationService.initNewStep();
  }

  deleteStep(step: IterationStep): void {
    this.iterationStepsService.deleteObject(step);
  }

  hasPlan(step: IterationStep): boolean {
    return !!step.plan && step.plan.status == RunStatus.finished;
  }

  notSolvable(step: IterationStep): boolean {
    return (
      step.status == StepStatus.unsolvable ||
      (step.plan && step.plan.status == RunStatus.noSolution)
    );
  }

  hasError(step: IterationStep): boolean {
    return step.plan && step.plan.status == RunStatus.failed;
  }

  isPending(step: IterationStep): boolean {
    return step.plan && step.plan.status == RunStatus.pending;
  }
}
