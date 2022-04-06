import { IterationStepsService } from 'src/app/service/planner-runs/iteration-steps.service';
import { take } from 'rxjs/operators';
import { PlanProperty } from './../../../../interface/plan-property/plan-property';
import { PlanPropertyMapService } from './../../../../service/plan-properties/plan-property-services';
import { IterationStep, StepStatus } from 'src/app/interface/run';
import { Observable, combineLatest } from 'rxjs';
import { PlannerService } from 'src/app/service/planner-runs/planner.service';
import { NewIterationStepService } from './../../../../service/planner-runs/selected-iteration-step.service';
import { Component, OnInit } from '@angular/core';
import { ModifiedPlanningTask } from 'src/app/interface/planning-task-relaxation';

@Component({
  selector: 'app-new-step-navigator',
  templateUrl: './new-step-navigator.component.html',
  styleUrls: ['./new-step-navigator.component.scss']
})
export class NewStepNavigatorComponent implements OnInit {

  step$: Observable<IterationStep>;
  planProperties$: Observable<Map<string,PlanProperty>>;

  constructor(
    private newIterationStepService: NewIterationStepService,
    private iterationStepsService: IterationStepsService,
    private planPropertyMapService: PlanPropertyMapService,
  ) {
    this.step$ = newIterationStepService.getSelectedObject();
    this.planProperties$ = planPropertyMapService.getMap();

    this.step$.subscribe(step => console.log(step));
  }

  ngOnInit(): void {
  }

  addNewStep(): void {
    combineLatest([this.step$, this.planProperties$]).pipe(take(1)).subscribe(
      ([step, planProperties]) => {
        if (step && planProperties) {
          // let name = 'Step ' +  this.iterationStepsService.getNumRuns();
          let softGoals = [];
          for (const pp of planProperties.values()) {
            if (!step.hardGoals.find(p => p === pp._id) && pp.isUsed) {
              softGoals.push(pp);
            }
          }
          let newTask: ModifiedPlanningTask = {name: 'task', project: step.task.project, basetask: step.task.basetask, initUpdates: step.task.initUpdates};
          let newStep: IterationStep = {
            name: step.name,
            project: step.project,
            status: StepStatus.unknown,
            hardGoals: [...step.hardGoals],
            softGoals: [...softGoals],
            task: newTask};
          console.log("New Step");
          console.log(newStep);
          this.iterationStepsService.saveObject(newStep);
          this.newIterationStepService.removeCurrentObject();
        }
      }
    )

    }

}
