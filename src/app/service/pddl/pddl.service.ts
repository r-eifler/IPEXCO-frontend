import {
  ObjectCollectionService,
  QueryParam,
} from "../base/object-collection.service";
import {
  PlanningTaskRelaxationsStore,
  PlanPropertyMapStore,
} from "../../store/stores.store";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { PlanProperty } from "../../interface/plan-property/plan-property";
import { environment } from "../../../environments/environment";
import { ObjectMapService } from "../base/object-map.service";
import { PlanningTaskRelaxationSpace } from "src/app/interface/planning-task-relaxation";
import { IHTTPData } from "src/app/interface/http-data.interface";
import { ADD, EDIT, LOAD } from "src/app/store/generic-list.store";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PDDLService {

  http: HttpClient;
  BASE_URL  = environment.apiURL + "pddl/";
  private domain$: BehaviorSubject<any>;

  constructor(http: HttpClient) {
    this.http = http;
    this.domain$ = new BehaviorSubject<any>(null);
  }

  getDomain(){
    return this.domain$;
  }

  translateDomain(domainText: string) {

    return this.http.post<IHTTPData<any>>(this.BASE_URL, {
        domainText: domainText,
      })
      .subscribe((httpData) => {
        console.log(httpData.data)
        this.domain$.next(httpData.data)
      });
  }
}
