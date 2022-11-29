import { DemoIterationStepsService } from "./demo-iteration-steps.service";
import { factEquals } from "src/app/interface/plannig-task";
import { take } from "rxjs/operators";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { RunningDemoService } from "../demo/demo-services";
import {
  DepExplanationRun,
  isStepSolvable,
  IterationStep,
  PlanRun,
  RunStatus,
  StepStatus,
} from "../../interface/run";
import { Demo } from "../../interface/demo";
import { PlannerService } from "./planner.service";
import { SelectedIterationStepService } from "./selected-iteration-step.service";
import { IterationStepsService } from "./iteration-steps.service";

@Injectable({
  providedIn: "root",
})
export class DemoPlannerService extends PlannerService {
  constructor(
    http: HttpClient,
    selectedStepService: SelectedIterationStepService,
    iterationStepsService: IterationStepsService
  ) {
    super(http, selectedStepService, iterationStepsService);
    this.BASE_URL = environment.apiURL + "planner/";
  }

  myBaseURL = environment.apiURL + "planner/";

  computePlan(step: IterationStep, save = false): void {
    super.computePlan(step, save);
  }

  computeMUGS(step: IterationStep, save = false): DepExplanationRun {
    // TODO

    return null;
  }

  computeMUGSfromQuestion(
    step: IterationStep,
    question: string[],
    save = false
  ): DepExplanationRun {
    // TODO

    return null;
  }

  computeRelaxExplanations(step: IterationStep, demo: Demo = null): Promise<IterationStep> {
    return new Promise((resolve, reject) => {
      console.log("Demo computeRelaxExplanations");
      if (!demo) {
        return reject(step);
      }
      if(demo.explanations.length > 0){
        let initUpdates = step.task.initUpdates;
        let expRuns = demo.explanations.filter((expRun) =>
          expRun.initUpdates.every((up1) =>
            initUpdates.some(
              (up2) =>
                factEquals(up1.orgFact, up2.orgFact) &&
                factEquals(up1.newFact, up2.newFact)
            )
          )
        );
        if (expRuns.length == 1) {
          step.relaxationExplanations = expRuns[0].relaxationExplanations;
          console.log(step.relaxationExplanations[0].dependencies);
          let solvable = isStepSolvable(step);
          step.status = solvable ? StepStatus.solvable : StepStatus.unsolvable;
          this.iterationStepsService.saveObject(step);
          this.selectedStepService.updateIfSame(step);
          return resolve(step);
        } else {
          console.error("No matching explanation");
          return resolve(step);
        }
      } else if (demo.conflictExplanation) {
        step.depExplanation = demo.conflictExplanation;
        let solvable = isStepSolvable(step);
        step.status = solvable ? StepStatus.solvable : StepStatus.unsolvable;
        this.iterationStepsService.saveObject(step);
        this.selectedStepService.updateIfSame(step);
        return resolve(step);
      } else {
        console.error("Error: No explantion");
        return reject(step);
      }
    });

  }
}
