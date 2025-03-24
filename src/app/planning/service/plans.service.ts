import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { array, boolean } from "zod";
import { Plan, PlanBase, PlanZ } from "../domain/plan";


@Injectable()
export class PlanningPlansService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "plan/";

    getPlan$(id: string): Observable<Plan> {
        return this.http.get<unknown>(this.BASE_URL + id).pipe(
            map(data => PlanZ.parse(data)),
        )
    }

    getPlans$(id: string): Observable<Plan[]> {
        let httpParams = new HttpParams();
        httpParams = httpParams.set('projectId', id);

        return this.http.get<unknown>(this.BASE_URL,  { params: httpParams}).pipe(
            map(data => array(PlanZ).parse(data)),
        )
    }

    postPlan$(plan: PlanBase): Observable<Plan> {
        return this.http.post<unknown>(this.BASE_URL, plan).pipe(
            map(data => PlanZ.parse(data)),
        )
    }

    postCancel$(id: string): Observable<boolean> {
        return this.http.post<unknown>(this.BASE_URL + 'cancel/' + id, {}).pipe(
            map(data => boolean().parse(data)),
        )
    }
}