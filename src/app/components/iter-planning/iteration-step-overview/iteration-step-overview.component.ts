import { PlanProperty } from './../../../interface/plan-property/plan-property';
import { IterationStepsService } from 'src/app/service/planner-runs/iteration-steps.service';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { IterationStep, ModIterationStep, RunStatus, StepStatus } from './../../../interface/run';
import { SelectedIterationStepService } from './../../../service/planner-runs/selected-iteration-step.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlannerService } from 'src/app/service/planner-runs/planner.service';
import { PlanPropertyMapService } from 'src/app/service/plan-properties/plan-property-services';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-iteration-step-overview',
  templateUrl: './iteration-step-overview.component.html',
  styleUrls: ['./iteration-step-overview.component.scss']
})
export class IterationStepOverviewComponent implements OnInit, OnDestroy {

  private unsubscribe$: Subject<any> = new Subject();

  step$: BehaviorSubject<IterationStep>;
  planPropertiesMap$: BehaviorSubject<Map<string, PlanProperty>>;

  constructor(
    private selectedIterationStepService: SelectedIterationStepService,
    private iterationStepsService: IterationStepsService,
    private planpropertiesService: PlanPropertyMapService,
    private plannerService: PlannerService,
  ) {

    this.step$ = selectedIterationStepService.findSelectedObject();
    this.planPropertiesMap$ = planpropertiesService.getMap();
    console.log(this.step$.getValue());

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  deselectPP(pp: PlanProperty) {
    console.log(pp);
    let currentStep = this.step$.getValue();
    if(currentStep.canBeModified()){
      currentStep.hardGoals = currentStep.hardGoals.filter(p => p._id !== pp._id);
      this.selectedIterationStepService.saveObject(currentStep);
    }
    else {
      let modStep = new ModIterationStep('Next Step', currentStep)
      modStep.hardGoals = modStep.hardGoals.filter(p => p._id !== pp._id)
      this.selectedIterationStepService.saveObject(modStep);
    }
  }

  addNewStep(): void {
    combineLatest([this.step$, this.planPropertiesMap$])
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(([step, planProperties]) => {
      if (step && planProperties) {
        let name = 'Step ' +  this.iterationStepsService.getNumRuns();
        let softGoals = [];
        for (const pp of planProperties.values()) {
          if (!step.hardGoals.find(p => p._id === pp._id) && pp.isUsed) {
            softGoals.push(pp);
          }
        }
        let newStep = new IterationStep(name, step.project, StepStatus.unknown, step.hardGoals, softGoals, step.task, null);
        this.iterationStepsService.saveObject(newStep);
      }
    });
  }

  computePlan(): void {
    this.plannerService.computePlan(this.step$.value);
  }

}
