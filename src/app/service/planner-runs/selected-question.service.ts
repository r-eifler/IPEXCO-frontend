import { enableProdMode, Injectable } from "@angular/core";
import { SelectedObjectService } from "../base/selected-object.service";
import { DepExplanationRun, RunStatus } from "../../interface/run";
import { CurrentQuestionStore } from "../../store/stores.store";
import { PlanPropertyMapService } from "../plan-properties/plan-property-services";
import { LOAD } from "../../store/generic-list.store";
import { updateMUGSPropsNames } from "./utils";
import { PlanProperty } from "../../interface/plan-property/plan-property";

@Injectable({
  providedIn: "root",
})
export class SelectedQuestionService extends SelectedObjectService<DepExplanationRun> {
  constructor(
    store: CurrentQuestionStore,
    protected planPropertiesService: PlanPropertyMapService
  ) {
    super(store);
  }

  saveObject(expRun: DepExplanationRun) {
    // TODO
    // if (expRun && ! expRun.mugs && expRun.status === RunStatus.finished) {
    //   const result = JSON.parse(expRun.result);
    //   const planProperties: Map<string, PlanProperty> = this.planPropertiesService.getMap().value;
    //   expRun.mugs = updateMUGSPropsNames(result.MUGS, planProperties);
    // }
    this.selectedObjectStore.dispatch({ type: LOAD, data: expRun });
  }
}
