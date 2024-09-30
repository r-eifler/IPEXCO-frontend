import { Injectable } from "@angular/core";
import { SelectedObjectService } from "../base/selected-object.service";
import {
  SelectedIterationStepStore,
  NewIterationStepStore,
} from "../../store/stores.store";
import { LOAD } from "../../store/generic-list.store";
import { IterationStep, ModIterationStep } from "src/app/iterative_planning/domain/run";

@Injectable({
  providedIn: "root",
})
export class SelectedIterationStepService extends SelectedObjectService<IterationStep> {
  constructor(
    store: SelectedIterationStepStore,
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
