import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { array, boolean } from "zod";
import { PlanProperty, PlanPropertyOfProject, PlanPropertyZ } from "../../shared/domain/plan-property/plan-property";


@Injectable()
export class PlanPropertyService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "plan-property/";

    getPlanProperties$(id: string): Observable<Record<string,PlanProperty>> {

        let httpParams = new HttpParams();
        httpParams = httpParams.set('projectId', id);
        
        return this.http.get<unknown>(this.BASE_URL,  { params: httpParams }).pipe(
            map((data) => array(PlanPropertyZ).parse(data)),
            map(props => props.reduce((acc, cv) => ({...acc,[cv._id]: cv}), {}))
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