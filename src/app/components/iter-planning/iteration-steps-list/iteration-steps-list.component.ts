import { MatSelectionListChange } from '@angular/material/list';
import { IterationStep, ModIterationStep } from './../../../interface/run';
import { SelectedIterationStepService, NewIterationStepService } from './../../../service/planner-runs/selected-iteration-step.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IterationStepsService } from 'src/app/service/planner-runs/iteration-steps.service';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-iteration-steps-list',
  templateUrl: './iteration-steps-list.component.html',
  styleUrls: ['./iteration-steps-list.component.scss']
})
export class IterationStepsListComponent implements OnInit, OnDestroy {

  private unsubscribe$: Subject<any> = new Subject();

  steps$: BehaviorSubject<IterationStep[]>;
  newStep$: BehaviorSubject<IterationStep>;
  selected$: BehaviorSubject<IterationStep>;

  constructor(
    private iterationStepsService: IterationStepsService,
    private selectedIterationStepService: SelectedIterationStepService,
    private newIterationStepService: NewIterationStepService
  ) {

    this.steps$ = iterationStepsService.getList();
    this.newStep$ = newIterationStepService.getSelectedObject()
    this.selected$ = selectedIterationStepService.getSelectedObject();

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  selectStep(event: MatSelectionListChange): void {
    let step = event.options[0].value as IterationStep
    this.selectedIterationStepService.saveObject(step);
  }

  selectNewStep() {
    this.selectedIterationStepService.removeCurrentObject();
  }

  newStep() {
    this.selected$.pipe(take(1)).subscribe(step => {
      if(step){
        let modStep = new ModIterationStep('Step ' + (this.iterationStepsService.getNumRuns() + 1), step)
        this.newIterationStepService.saveObject(modStep);
        this.selectedIterationStepService.removeCurrentObject();
      }
    });
  }

  deleteStep(step: IterationStep): void {
    this.iterationStepsService.deleteObject(step);
  }

}
