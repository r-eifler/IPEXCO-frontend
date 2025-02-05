import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map, tap } from "rxjs/operators";
import { IHTTPData } from "src/app/shared/domain/http-data.interface";
import { webSocket }  from 'rxjs/webSocket';



@Injectable()
export class PlannerService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "planner/plan-step/";


    postComputePlan$(stepId: string): Observable<boolean> {

        return this.http.post<IHTTPData<boolean>>(this.BASE_URL + stepId, {data: stepId}).pipe(
            map(({data}) => data)
        )

    }
}