import { ModIterationStep } from "src/app/interface/run";
import { ModifiedPlanningTask } from "./../../interface/planning-task-relaxation";
import { IterationStep } from "./../../interface/run";
import { CurrentProjectService } from "src/app/service/project/project-services";
import { Injectable } from "@angular/core";
import { SelectedObjectService } from "../base/selected-object.service";
import {
  SelectedIterationStepStore,
  CurrentRunStore,
  NewIterationStepStore,
} from "../../store/stores.store";
import { PddlFileUtilsService } from "../files/pddl-file-utils.service";
import { PlanPropertyMapService } from "../plan-properties/plan-property-services";
import { combineLatest } from "rxjs/internal/observable/combineLatest";
import { LOAD } from "../../store/generic-list.store";

@Injectable({
  providedIn: "root",
})
export class SelectedIterationStepService extends SelectedObjectService<IterationStep> {
  constructor(
    store: SelectedIterationStepStore,
    private fileUtilsService: PddlFileUtilsService,
    private currentProjectService: CurrentProjectService,
    private planPropertyMapService: PlanPropertyMapService
  ) {
    super(store);
  }

  saveObject(obj: IterationStep) {
    console.log(obj);
    this.selectedObjectStore.dispatch({ type: LOAD, data: obj });
  }
}

@Injectable({
  providedIn: "root",
})
export class NewIterationStepStoreService extends SelectedObjectService<ModIterationStep> {
  constructor(store: NewIterationStepStore) {
    super(store);
  }

  saveObject(object: ModIterationStep) {
    let step = { ...object };
    // console.log("New Step");
    // console.log(step);
    this.selectedObjectStore.dispatch({ type: LOAD, data: step });
  }
}
