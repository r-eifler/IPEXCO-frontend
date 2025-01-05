import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { IHTTPData } from "src/app/shared/domain/http-data.interface";
import { PlanProperty } from "src/app/shared/domain/plan-property/plan-property";


@Injectable()
export class UserStudyExecutionPlanPropertyService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "plan-property/";


    getPlanPropertiesList$(id: string): Observable<PlanProperty[]> {

        let httpParams = new HttpParams();
        httpParams = httpParams.set('projectId', id);
        
        return this.http.get<IHTTPData<PlanProperty[]>>(this.BASE_URL,  { params: httpParams }).pipe(
            map(({data}) => data)
        )
    }

}