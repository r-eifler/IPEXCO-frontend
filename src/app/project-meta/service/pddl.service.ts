import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { IHTTPData } from "src/app/shared/domain/http-data.interface";
import { BehaviorSubject } from "rxjs";
import { PlanningDomain, PlanningModel, PlanningProblem } from "src/app/shared/domain/planning-task";

@Injectable({
  providedIn: "root",
})
export class PDDLService {

  http: HttpClient;
  BASE_URL  = environment.apiURL + "pddl/";

  private domain$: BehaviorSubject<PlanningDomain>;
  private problem$: BehaviorSubject<PlanningProblem>;
  private model$: BehaviorSubject<PlanningModel>;

  constructor(http: HttpClient) {
    this.http = http;
    this.domain$ = new BehaviorSubject<PlanningDomain>(null);
    this.problem$ = new BehaviorSubject<PlanningProblem>(null);
    this.model$ = new BehaviorSubject<PlanningModel>(null);
  }

  getDomain(){
    return this.domain$;
  }

  getProblem(){
    return this.problem$;
  }

  getModel(){
    return this.model$;
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

  translateModel(domainText: string, problemText: string) {

    return this.http.post<IHTTPData<any>>(this.BASE_URL + "model", {data: {problem: problemText, domain: domainText}})
      .subscribe((httpData) => {
        console.log(httpData.data)
        this.model$.next(httpData.data)
      });
  }
}
