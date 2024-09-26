import { DemoIterationStepsService } from "./demo-iteration-steps.service";
import { factEquals } from "src/app/interface/planning-task";
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

}