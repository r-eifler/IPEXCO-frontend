import { RunningDemoService } from "src/app/service/demo/demo-services";
import { Project } from "src/app/interface/project";
import { CurrentProjectService } from "src/app/service/project/project-services";
import { DemoPlannerService } from "./demo-planner.service";
import { PlannerService } from "src/app/service/planner-runs/planner.service";
import { DemoIterationStepsService } from "./demo-iteration-steps.service";
import { Injectable } from "@angular/core";
import { combineLatest, Observable } from "rxjs";
import { filter, take } from "rxjs/operators";
import { PlanProperty } from "../../interface/plan-property/plan-property";
import {
  ModifiedPlanningTask,
  PlanningTaskRelaxationSpace,
} from "../../interface/planning-task-relaxation";
import { IterationStep, ModIterationStep, StepStatus } from "../../interface/run";
import { PlanPropertyMapService } from "../plan-properties/plan-property-services";
import { IterationStepsService } from "./iteration-steps.service";
import {
  NewIterationStepStoreService,
  SelectedIterationStepService,
} from "./selected-iteration-step.service";
import { PlanningTaskRelaxationService } from "../planning-task/planning-task-relaxations-services";
import { Demo } from "../../interface/demo";
import { SelectedObjectService } from "../base/selected-object.service";

@Injectable({
  providedIn: "root",
})
export class NewIterationStepGenerationService {
  newStep$: Observable<IterationStep>;
  selectedStep$: Observable<IterationStep>;
  planProperties$: Observable<Map<string, PlanProperty>>;
  project$: Observable<Project>;

  constructor(
    protected newIterationStepStoreService: NewIterationStepStoreService,
    protected iterationStepsService: IterationStepsService,
    protected selectedIterationStepService: SelectedIterationStepService,
    protected planPropertyMapService: PlanPropertyMapService,
    protected plannerService: PlannerService,
    protected currentProjectService: CurrentProjectService
  ) {
    this.newStep$ = this.newIterationStepStoreService.getSelectedObject();
    this.selectedStep$ = selectedIterationStepService.getSelectedObject();
    this.planProperties$ = this.planPropertyMapService.getMap();
    this.project$ = this.currentProjectService.getSelectedObject();
  }

  createInitialStep() {
    combineLatest([this.project$, this.planProperties$])
      .pipe(
        filter(([project, ppM]) => !!project && !!ppM && ppM.size > 0),
        take(1)
      )
      .subscribe(async ([project, planProperties]) => {
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
        let newTask: ModifiedPlanningTask = {
          name: "task",
          project: project._id,
          basetask: project.baseTask,
          initUpdates: [],
        };
        let newStep: IterationStep = {
          name: "Itertaion Step 1",
          project: project._id,
          status: StepStatus.unknown,
          hardGoals: [...hardGoals],
          softGoals: [...softGoals],
          task: newTask,
        };
        console.log("New Step");
        console.log(newStep);

        let storedStep = await this.iterationStepsService.saveObject(newStep);

        if (project.settings.computeDependenciesAutomatically) {
          console.log("Project: Compute Explanations automatically...")
          storedStep = await this.plannerService.computeRelaxExplanations(storedStep);
        }
        if (project.settings.computePlanAutomatically) {
          console.log("Compute plan automatically...")
          await this.plannerService.computePlan(newStep);
        }

      });
  }

  initNewStep() {
    console.log("New Step");
    this.selectedStep$.pipe(take(1)).subscribe((step) => {
      if (step) {
        let modStep: ModIterationStep = {
          name:
            "Iteration Step " + (this.iterationStepsService.getNumRuns() + 1),
          baseStep: step,
          task: step.task,
          status: StepStatus.unknown,
          project: step.project,
          hardGoals: [...step.hardGoals],
          softGoals: [],
        };
        this.newIterationStepStoreService.saveObject(modStep);
        this.selectedIterationStepService.removeCurrentObject();
      }
    });
  }

  finishNewStep(): void {
    combineLatest([this.newStep$, this.planProperties$, this.project$])
      .pipe(
        filter(
          ([step, planProperties, project]) =>
            !!step && !!planProperties && !!project
        ),
        take(1)
      )
      .subscribe(([step, planProperties, project]) => {
        if (step && planProperties) {
          // let name = 'Step ' +  this.iterationStepsService.getNumRuns();
          let softGoals = [];
          for (const pp of planProperties.values()) {
            if (!step.hardGoals.find((p) => p === pp._id) && pp.isUsed) {
              softGoals.push(pp._id);
            }
          }
          let newTask: ModifiedPlanningTask = {
            name: "task",
            project: step.task.project,
            basetask: step.task.basetask,
            initUpdates: step.task.initUpdates,
          };
          let newStep: IterationStep = {
            name: step.name,
            project: step.project,
            status: StepStatus.unknown,
            hardGoals: [...step.hardGoals],
            softGoals: [...softGoals],
            task: newTask,
          };
          console.log("New Step");
          console.log(newStep);
          this.iterationStepsService.saveObject(newStep);
          this.newIterationStepStoreService.removeCurrentObject();
        }
      });
  }
}

@Injectable({
  providedIn: "root",
})
export class DemoNewIterationStepGenerationService extends NewIterationStepGenerationService {
  relaxationSpaces$: Observable<PlanningTaskRelaxationSpace[]>;
  demo$: Observable<Demo>;

  constructor(
    newIterationStepStoreService: NewIterationStepStoreService,
    iterationStepsService: IterationStepsService,
    selectedIterationStepService: SelectedIterationStepService,
    planPropertyMapService: PlanPropertyMapService,
    protected plannerService: PlannerService,
    protected currentProjectService: RunningDemoService,
    protected planningTaskRelaxationService: PlanningTaskRelaxationService
  ) {
    super(
      newIterationStepStoreService,
      iterationStepsService,
      selectedIterationStepService,
      planPropertyMapService,
      plannerService,
      currentProjectService
    );

    this.relaxationSpaces$ = this.planningTaskRelaxationService.getList();
    this.demo$ = currentProjectService.getSelectedObject();
  }

  createInitialStep(save=false) {
    console.log("Create initial iteration step DEMO");
    combineLatest([this.demo$, this.planProperties$, this.relaxationSpaces$])
      .pipe(
        filter(
          ([demo, ppM, spaces]) =>
            !!demo && !!ppM && ppM.size > 0 && !!spaces && spaces.length > 0
        ),
        take(1)
      )
      .subscribe(async ([demo, planProperties, relaxationSpaces]) => {
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
        let initUpdates = [];
        relaxationSpaces.forEach((space) =>
          space.dimensions.forEach((dim) =>
            initUpdates.push({
              orgFact: dim.orgFact.fact,
              newFact: dim.orgFact.fact,
            })
          )
        );
        let newTask: ModifiedPlanningTask = {
          name: "task",
          project: demo._id,
          basetask: demo.baseTask,
          initUpdates,
        };
        let newStep: IterationStep = {
          name: "Itertaion Step 1",
          project: demo._id,
          status: StepStatus.unknown,
          hardGoals: [...hardGoals],
          softGoals: [...softGoals],
          task: newTask,
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
          let newTask: ModifiedPlanningTask = {
            name: "task",
            project: step.task.project,
            basetask: step.task.basetask,
            initUpdates: step.task.initUpdates,
          };
          let newStep: IterationStep = {
            name: step.name,
            project: step.project,
            status: StepStatus.unknown,
            hardGoals: [...step.hardGoals],
            softGoals: [...softGoals],
            task: newTask,
          };
          console.log("New Step");
          console.log(newStep);

          let storedStep = await this.iterationStepsService.saveObject(newStep);
          this.newIterationStepStoreService.removeCurrentObject();

          if (demo.settings.computeDependenciesAutomatically) {
            console.log("Compute Explanations automatically...")
            storedStep = await this.plannerService.computeRelaxExplanations(newStep,demo);
          }
          if (demo.settings.computePlanAutomatically && storedStep.status == StepStatus.solvable) {
            console.log("Compute Plan automatically...")
            this.plannerService.computePlan(newStep);
          }
        }
      });
  }
}
