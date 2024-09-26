import { RunningDemoService } from "src/app/service/demo/demo-services";
import { PlannerService } from "src/app/service/planner-runs/planner.service";
import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { filter, take } from "rxjs/operators";
import {
  ModifiedPlanningTask,
  PlanningTaskRelaxationSpace,
} from "../../interface/planning-task-relaxation";
import { IterationStep, StepStatus } from "../../interface/run";
import { PlanPropertyMapService } from "../plan-properties/plan-property-services";
import { IterationStepsService } from "./iteration-steps.service";
import {
  NewIterationStepStoreService,
  SelectedIterationStepService,
} from "./selected-iteration-step.service";
import { Demo } from "../../interface/demo";
import { NewIterationStepGenerationService } from "./new-iteration-step-generation-service.service";

@Injectable({
  providedIn: "root",
})
export class DemoNewIterationStepGenerationService extends NewIterationStepGenerationService {

  demo$: Observable<Demo>;

  constructor(
    newIterationStepStoreService: NewIterationStepStoreService,
    iterationStepsService: IterationStepsService,
    selectedIterationStepService: SelectedIterationStepService,
    planPropertyMapService: PlanPropertyMapService,
    protected plannerService: PlannerService,
    protected currentProjectService: RunningDemoService,
  ) {
    super(
      newIterationStepStoreService,
      iterationStepsService,
      selectedIterationStepService,
      planPropertyMapService,
      plannerService,
      currentProjectService
    );

    this.demo$ = currentProjectService.getSelectedObject() as BehaviorSubject<Demo>;
  }

  createInitialStep(save=false) {
    console.log("Create initial iteration step DEMO");
    combineLatest([this.demo$, this.planProperties$])
      .pipe(
        filter(
          ([demo, ppM]) =>
            !!demo && !!ppM && ppM.size > 0 && (! demo.settings?.useConstraints)
        ),
        take(1)
      )
      .subscribe(async ([demo, planProperties]) => {
        console.log("Generate initial Iteration Step");
        console.log("#planProperties: " + planProperties.size);
        let softGoals = [];
        let hardGoals = [];
        for (const pp of planProperties.values()) {
          if (pp.globalHardGoal) {
            hardGoals.push(pp._id);
          } else {
            softGoals.push(pp._id);
          }
        }

        let newStep: IterationStep = {
          name: "Iteration Step 1",
          project: demo._id,
          status: StepStatus.unknown,
          hardGoals: [...hardGoals],
          softGoals: [...softGoals],
          task: demo.baseTask,
        };

        console.log("New Step");
        console.log(newStep);
        let storedStep = await this.iterationStepsService.saveObject(newStep);

        let solvable = true;
        if (demo.settings.computeDependenciesAutomatically) {
          console.log("Demo: Compute Explanations automatically...")
          storedStep = await this.plannerService.computeRelaxExplanations(storedStep,demo);
        }
        if (demo.settings.computePlanAutomatically && storedStep.status == StepStatus.solvable) {
          console.log("Demo: Compute Plan automatically...")
          this.plannerService.computePlan(storedStep);
        }
      });
  }

  finishNewStep(): void {
    combineLatest([this.newStep$, this.planProperties$, this.demo$])
      .pipe(
        filter(
          ([step, planProperties, demo]) => !!step && !!planProperties && !!demo
        ),
        take(1)
      )
      .subscribe(async ([step, planProperties, demo]) => {
        if (step && planProperties) {
          // let name = 'Step ' +  this.iterationStepsService.getNumRuns();
          let softGoals = [];
          for (const pp of planProperties.values()) {
            if (!step.hardGoals.find((p) => p === pp._id) && pp.isUsed) {
              softGoals.push(pp._id);
            }
          }

          let newStep: IterationStep = {
            name: step.name,
            project: step.project,
            status: StepStatus.unknown,
            hardGoals: [...step.hardGoals],
            softGoals: [...softGoals],
            task: step.task,
          };
          console.log("New Step");
          console.log(newStep);

          this.newIterationStepStoreService.removeCurrentObject();
          let storedStep = await this.iterationStepsService.saveObject(newStep);

          if (demo.settings.computeDependenciesAutomatically) {
            console.log("Compute Explanations automatically...")
            storedStep = await this.plannerService.computeRelaxExplanations(storedStep,demo);
          }
          if (demo.settings.computePlanAutomatically && storedStep.status == StepStatus.solvable) {
            console.log("Compute Plan automatically...")
            this.plannerService.computePlan(storedStep);
          }
        }
      });
  }
}
