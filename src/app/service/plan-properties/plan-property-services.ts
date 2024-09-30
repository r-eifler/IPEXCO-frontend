import { PlanPropertyMapStore } from "../../store/stores.store";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { PlanProperty } from "../../iterative_planning/domain/plan-property/plan-property";
import { environment } from "../../../environments/environment";
import { ObjectMapService } from "../base/object-map.service";

@Injectable({
  providedIn: "root",
})
export class PlanPropertyMapService extends ObjectMapService<
  string,
  PlanProperty
> {
  constructor(http: HttpClient, store: PlanPropertyMapStore) {
    super(http, store);
    this.BASE_URL = environment.apiURL + "plan-property/";
    // this.pipeGet = map((value: PlanProperty): PlanProperty => { value.goalType = GoalType.planProperty; return value; });
    // this.pipeFind = map((value: PlanProperty[]): PlanProperty[] => {
    //   for (const p of value) {
    //     p.goalType = GoalType.planProperty;
    //   }
    //   return value;
    // });
  }

  getKey(t: PlanProperty): string {
    return t._id;
  }
}
