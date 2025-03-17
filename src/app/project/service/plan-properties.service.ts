import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { IHTTPData } from "src/app/shared/domain/http-data.interface";
import { PlanProperty, PlanPropertyOfProject, PlanPropertyZ } from "src/app/shared/domain/plan-property/plan-property";
import { array, boolean } from "zod";

@Injectable()
export class ProjectPlanPropertyService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "plan-property/";

    getPlanProperties$(id: string): Observable<Record<string,PlanProperty>> {

        let httpParams = new HttpParams();
        httpParams = httpParams.set('projectId', id);
        
        return this.http.get<unknown>(this.BASE_URL,  { params: httpParams }).pipe(
            map((data) => array(PlanPropertyZ).parse(data)),
            map(props => props.reduce((acc, cv) => ({...acc,[cv._id]: cv}), {}) as Record<string,PlanProperty>)
        )
    }

    getPlanPropertiesList$(id: string): Observable<PlanProperty[]> {

        let httpParams = new HttpParams();
        httpParams = httpParams.set('projectId', id);
        
        return this.http.get<unknown>(this.BASE_URL,  { params: httpParams }).pipe(
            map((data) => array(PlanPropertyZ).parse(data))
        )
    }
    
    postPlanProperty$(planProperty: PlanPropertyOfProject): Observable<PlanProperty> {

        return this.http.post<unknown>(this.BASE_URL, planProperty).pipe(
            map((data) => PlanPropertyZ.parse(data)),
        )
    }

    putPlanProperty$(planProperty: PlanProperty): Observable<PlanProperty> {

        return this.http.put<unknown>(this.BASE_URL + planProperty._id, planProperty).pipe(
            map((data) => PlanPropertyZ.parse(data)),
        )
    }

    deletePLanProperty$(id: string): Observable<boolean> {

        return this.http.delete<unknown>(this.BASE_URL + id).pipe(
            map((data) => boolean().parse(data))
        )
    }
}