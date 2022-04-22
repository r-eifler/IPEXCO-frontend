import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IterationStepsStore, RunsStore } from "../../store/stores.store";
import { PlanPropertyMapService } from "../plan-properties/plan-property-services";
import { IterationStepsService } from "./iteration-steps.service";
import { CurrentProjectService } from "../project/project-services";
import { SelectedIterationStepService } from "./selected-iteration-step.service";

interface QueryParam {
  param: string;
  value: string;
}

@Injectable({
  providedIn: "root",
})
export class DemoRunService extends IterationStepsService {
  constructor(
    http: HttpClient,
    store: IterationStepsStore,
    workingIterationStepService: SelectedIterationStepService
  ) {
    super(http, store, workingIterationStepService);
  }

  findCollection(queryParams: QueryParam[] = []) {
    return this.collection$;
  }
}
