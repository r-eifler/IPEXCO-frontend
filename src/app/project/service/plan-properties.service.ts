import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { IHTTPData } from "src/app/interface/http-data.interface";
import { PlanProperty } from "src/app/shared/domain/plan-property/plan-property";
import { ProjectModule } from "../project.module";


@Injectable({
    providedIn: ProjectModule
})
export class ProjectPlanPropertyService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "plan-property/";

    getPlanProperties$(id: string): Observable<Record<string,PlanProperty>> {

        let httpParams = new HttpParams();
        httpParams = httpParams.set('projectId', id);
        
        return this.http.get<IHTTPData<PlanProperty[]>>(this.BASE_URL,  { params: httpParams }).pipe(
            map(({data}) => data),
            map(props => props.reduce((acc, cv) => ({...acc,[cv._id]: cv}), {}))
        )
    }

    postPlanProperty$(planProperty: PlanProperty): Observable<PlanProperty> {

        return this.http.post<IHTTPData<PlanProperty>>(this.BASE_URL, {data: planProperty}).pipe(
            map(({data}) => data)
        )

    }

    putPlanProperty$(planProperty: PlanProperty): Observable<PlanProperty> {

        return this.http.put<IHTTPData<PlanProperty>>(this.BASE_URL + planProperty._id, {data: planProperty}).pipe(
            map(({data}) => data)
        )

    }

    deletePLanProperty$(id: string): Observable<boolean> {

        return this.http.delete<IHTTPData<boolean>>(this.BASE_URL + id).pipe(
            map(({data}) => data)
        )

    }
}