import { IterationStepsService } from 'src/app/service/planner-runs/iteration-steps.service';
import { BehaviorSubject } from 'rxjs';
import { IterationStep, RunStatus, StepStatus } from './../../../interface/run';
import { SelectedIterationStepService } from './../../../service/planner-runs/selected-iteration-step.service';
import { Component, OnInit } from '@angular/core';
import { PlannerService } from 'src/app/service/planner-runs/planner.service';

@Component({
  selector: 'app-iteration-step-overview',
  templateUrl: './iteration-step-overview.component.html',
  styleUrls: ['./iteration-step-overview.component.scss']
})
export class IterationStepOverviewComponent implements OnInit {

  step$: BehaviorSubject<IterationStep>;

  constructor(
    private workingIterationStepService: SelectedIterationStepService,
    private iterationStepsService: IterationStepsService,
    private plannerService: PlannerService,
  ) {

    this.step$ = workingIterationStepService.findSelectedObject();
    console.log(this.step$.getValue());

  }

  ngOnInit(): void {
  }

  addNewStep(): void {
    let modTask = this.step$.getValue();
    let name = 'Step ' +  this.iterationStepsService.getNumRuns();
    let newStep = new IterationStep(name, modTask.project, StepStatus.unknown, modTask.hardGoals, modTask.softGoals, modTask.task, null);
    this.iterationStepsService.saveObject(newStep);
  }

  computePlan(): void {
    this.plannerService.computePlan(this.step$.value);
  }

}
