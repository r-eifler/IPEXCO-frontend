import { PlanningTaskRelaxationService } from 'src/app/service/planning-task/planning-task-relaxations-services';
import { map, filter, takeUntil, tap } from 'rxjs/operators';
import { ModifiedPlanningTask, PlanningTaskRelaxationSpace, TaskUpdate, TaskUpdates } from './../../../../interface/planning-task-relaxation';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { IterationStep, ModIterationStep } from 'src/app/interface/run';
import { SelectedIterationStepService } from 'src/app/service/planner-runs/selected-iteration-step.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-relaxation-selector',
  templateUrl: './relaxation-selector.component.html',
  styleUrls: ['./relaxation-selector.component.scss']
})
export class RelaxationSelectorComponent implements OnInit, OnDestroy {

  private unsubscribe$: Subject<any> = new Subject();

  step$: BehaviorSubject<IterationStep>;
  task$: Observable<ModifiedPlanningTask>;
  relaxationSpaces$: Observable<PlanningTaskRelaxationSpace[]>;

  constructor(
    private selectedIterationStepService: SelectedIterationStepService,
    private relaxationService: PlanningTaskRelaxationService
  ) {

    this.step$ = selectedIterationStepService.findSelectedObject();

    this.step$.subscribe(
      t => console.log(t)
    )

    this.task$ = this.step$.pipe(
      filter(step => !!step),
      map(step => step.task),
      tap(t => console.log(t))
    ).pipe(takeUntil(this.unsubscribe$));

    this.relaxationSpaces$ = relaxationService.getList();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  updateSelected(event: MatSelectChange): void {
      let updates : TaskUpdates = event.value;
      let step = this.step$.getValue();
      if (step.canBeModified()) {
        step.task.taskUpdatList = step.task.taskUpdatList.filter(up => ! up.orgFact.equals(updates.orgFact))
        step.task.taskUpdatList.push(updates);
        this.selectedIterationStepService.saveObject(step);
      }
      else {
        let modStep = new ModIterationStep('Next Step', step)
        modStep.task.taskUpdatList = modStep.task.taskUpdatList.filter(up => ! up.orgFact.equals(updates.orgFact))
        modStep.task.taskUpdatList.push(updates);
        this.selectedIterationStepService.saveObject(modStep);
      }

  }

}
