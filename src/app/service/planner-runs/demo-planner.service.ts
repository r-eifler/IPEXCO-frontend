import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { PlannerService } from "./planner.service";
import { SelectedIterationStepService } from "./selected-iteration-step.service";
import { IterationStepsService } from "./iteration-steps.service";
import { DepExplanationRun, IterationStep } from "src/app/iterative_planning/domain/run";

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