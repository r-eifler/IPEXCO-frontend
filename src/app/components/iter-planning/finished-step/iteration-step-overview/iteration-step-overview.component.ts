import { ModifiedPlanningTask } from '../../../../interface/planning-task-relaxation';
import { PlanProperty } from '../../../../interface/plan-property/plan-property';
import { IterationStepsService } from 'src/app/service/planner-runs/iteration-steps.service';
import { BehaviorSubject, combineLatest, Subject, Observable } from 'rxjs';
import { IterationStep, ModIterationStep, RunStatus, StepStatus } from '../../../../interface/run';
import { SelectedIterationStepService } from '../../../../service/planner-runs/selected-iteration-step.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlannerService } from 'src/app/service/planner-runs/planner.service';
import { PlanPropertyMapService } from 'src/app/service/plan-properties/plan-property-services';
import { takeUntil, filter, tap } from 'rxjs/operators';

@Component({
  selector: 'app-iteration-step-overview',
  templateUrl: './iteration-step-overview.component.html',
  styleUrls: ['./iteration-step-overview.component.scss']
})
export class IterationStepOverviewComponent implements OnInit, OnDestroy {

  private unsubscribe$: Subject<any> = new Subject();

  step$: Observable<IterationStep>;
  planPropertiesMap$: BehaviorSubject<Map<string, PlanProperty>>;

  constructor(
    selectedIterationStepService: SelectedIterationStepService,
  ) {

    this.step$ = selectedIterationStepService.findSelectedObject().pipe(filter(step => !!step),tap(a => console.log(a)));

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
