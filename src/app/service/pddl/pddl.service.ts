import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { IHTTPData } from "src/app/interface/http-data.interface";
import { BehaviorSubject } from "rxjs";
import { PlanningDomain, PlanningProblem } from "src/app/interface/planning-task";

@Injectable({
  providedIn: "root",
})
export class PDDLService {

  http: HttpClient;
  BASE_URL  = environment.apiURL + "pddl/";

  private domain$: BehaviorSubject<PlanningDomain>;
  private problem$: BehaviorSubject<PlanningProblem>;

  constructor(http: HttpClient) {
    this.http = http;
    this.domain$ = new BehaviorSubject<PlanningDomain>(null);
    this.problem$ = new BehaviorSubject<PlanningProblem>(null);
  }

  getDomain(){
    return this.domain$;
  }

  getProblem(){
    return this.problem$;
  }

  translateDomain(domainText: string) {

    return this.http.post<IHTTPData<any>>(this.BASE_URL + "domain", {data: domainText})
      .subscribe((httpData) => {
        console.log(httpData.data)
        this.domain$.next(httpData.data)
      });
  }

  translateProblem(problemText: string) {

    return this.http.post<IHTTPData<any>>(this.BASE_URL + "problem", {data: problemText})
      .subscribe((httpData) => {
        console.log(httpData.data)
        this.problem$.next(httpData.data)
      });
  }
}
