import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { IHTTPData } from "src/app/shared/domain/http-data.interface";
import { environment } from "../../../environments/environment";
import { PDDLPlanningModel } from "src/app/shared/domain/PDDL_task";

@Injectable()
export class PDDLService {

  private http = inject(HttpClient)
  BASE_URL  = environment.apiURL + "pddl/";

  private model$ = new BehaviorSubject<PDDLPlanningModel>(null);

  getModel(){
    return this.model$;
  }

  translateModel(domainText: string, problemText: string) {

    return this.http.post<IHTTPData<any>>(this.BASE_URL + "model", {data: {problem: problemText, domain: domainText}})
      .subscribe((httpData) => {
        this.model$.next(httpData.data)
      });
  }
}
