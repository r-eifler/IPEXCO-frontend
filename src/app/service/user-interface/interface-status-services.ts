import { LocalObjectCollectionService } from "./../base/local-object-collection.service";
import { SelectedObjectService } from "../base/selected-object.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  FinishedStepInterfaceStatiStore,
  NewStepInterfaceStatusStore,
} from "../../store/stores.store";
import {
  FinishedStepInterfaceStatus,
  NewStepInterfaceStatus,
} from "src/app/interface/interface-status";

@Injectable({
  providedIn: "root",
})
export class FinishedStepInterfaceStatusService extends LocalObjectCollectionService<FinishedStepInterfaceStatus> {
  constructor(store: FinishedStepInterfaceStatiStore) {
    super(store);
  }
}

@Injectable({
  providedIn: "root",
})
export class NewStepInterfaceStatusService extends SelectedObjectService<NewStepInterfaceStatus> {
  constructor(store: NewStepInterfaceStatusStore) {
    super(store);
  }
}
