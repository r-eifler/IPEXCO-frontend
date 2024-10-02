import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { IHTTPData } from "src/app/interface/http-data.interface";
// import { Socket } from 'ngx-socket-io';



@Injectable()
export class PlannerService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "planner/";

    postComputePlan$(stepId: string): Observable<boolean> {

        return this.http.put<IHTTPData<boolean>>(this.BASE_URL + stepId, {data: stepId}).pipe(
            map(({data}) => data)
        )

    }

    listenPlanComputationFinished$(stepId: string): Observable<boolean> {

        return this.http.put<IHTTPData<boolean>>(this.BASE_URL + stepId, {data: stepId}).pipe(
            map(({data}) => data)
        )

    }
}