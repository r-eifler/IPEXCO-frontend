import { IterationStepsService } from "src/app/service/planner-runs/iteration-steps.service";
import { Injectable } from "@angular/core";
import { DemoPlannerService } from "./demo-planner.service";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { SelectedIterationStepService } from "./selected-iteration-step.service";
import { IterationStep } from "src/app/iterative_planning/domain/run";


@Injectable({
  providedIn: "root",
})
export class UserStudyPlannerService extends DemoPlannerService {
  myBaseURL = environment.apiURL + "planner/";

  constructor(
    http: HttpClient,
    selectedStepService: SelectedIterationStepService,
    iterationStepsService: IterationStepsService
  ) {
    super(http, selectedStepService, iterationStepsService);
    this.BASE_URL = environment.apiURL + "planner/";
  }

  computePlan(step: IterationStep): void {
    super.computePlan(step, true);
  }
}
