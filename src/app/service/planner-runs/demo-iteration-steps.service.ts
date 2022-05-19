import { DemoPlannerService } from "./demo-planner.service";
import { computePlanValue } from "src/app/interface/run";
import { ModifiedPlanningTask } from "../../interface/planning-task-relaxation";
import { SelectedIterationStepService } from "./selected-iteration-step.service";
import { CurrentProjectService } from "src/app/service/project/project-services";
import { IterationStepsStore } from "../../store/stores.store";
import {
  IterationStep,
  StepStatus,
  ModIterationStep,
  PlanRun,
} from "../../interface/run";
import { ADD, EDIT, LOAD, REMOVE } from "../../store/generic-list.store";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ObjectCollectionService } from "../base/object-collection.service";
import { environment } from "../../../environments/environment";
import { IHTTPData } from "../../interface/http-data.interface";
import { PlanPropertyMapService } from "../plan-properties/plan-property-services";
import { combineLatest } from "rxjs";
import { PlanProperty } from "src/app/interface/plan-property/plan-property";
import { IterationStepsService } from "./iteration-steps.service";

interface QueryParam {
  param: string;
  value: string;
}

@Injectable({
  providedIn: "root",
})
export class DemoIterationStepsService extends IterationStepsService {
  constructor(
    http: HttpClient,
    store: IterationStepsStore,
    selectedIterationStepService: SelectedIterationStepService
  ) {
    super(http, store, selectedIterationStepService);
    this.BASE_URL = environment.apiURL + "run/iter-step/";
    // this.pipeFind = map(sortRuns);
  }

  saveObject(step: IterationStep): Promise<IterationStep> {
    console.log("DemoIterationStepsService: Don't save the itertaion step.");
    return new Promise((resolve, reject) => {
      if (step._id) {
        this.listStore.dispatch({ type: EDIT, data: step });
      } else {
        step._id = "localId_" + this.collection$.value.length;
        this.selectedIterationStepService.saveObject(step);
        this.listStore.dispatch({ type: ADD, data: step });
      }
      resolve(step);
    });
  }

  findCollection() {
    return this.collection$;
  }

  getLastRun(): IterationStep {
    const lastValues: IterationStep[] = this.collection$.value;
    if (lastValues.length > 0) {
      return lastValues[lastValues.length - 1];
    } else {
      return null;
    }
  }

  getBestRun(planProperties: Map<string, PlanProperty>): IterationStep {
    if (this.collection$.value.length == 0) {
      return null;
    }
    return this.collection$.value.reduce(
      (max, cur) =>
        computePlanValue(cur, planProperties) >=
        computePlanValue(cur, planProperties)
          ? cur
          : max,
      this.collection$.value[0]
    );
  }

  getNumRuns(): number {
    return this.collection$.value.length;
  }

  getNumQuestions(): number {
    let res = 0;
    //TODO
    return res;
  }

  reset() {
    this.listStore.reset();
  }

  deleteObject(step: IterationStep): void {
    let index = this.collection$.getValue().indexOf(step);
    this.listStore.dispatch({ type: REMOVE, data: step });
    if (index < this.collection$.getValue().length) {
      this.selectedIterationStepService.saveObject(
        this.collection$.getValue()[index]
      );
    } else {
      this.selectedIterationStepService.saveObject(
        this.collection$.getValue()[this.collection$.getValue().length - 1]
      );
    }
  }
}
