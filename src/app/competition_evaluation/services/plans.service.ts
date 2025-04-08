import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { array } from "zod";
import { EvaluationInstance, EvaluationInstanceBase, EvaluationInstanceZ } from "../domain/evaluation_instance";


@Injectable()
export class EvalInstancesService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "competition_evaluation/";

    getPlan$(id: string): Observable<EvaluationInstance> {
        return this.http.get<unknown>(this.BASE_URL + id).pipe(
            map(data => EvaluationInstanceZ.parse(data)),
        )
    }

    getPlans$(): Observable<EvaluationInstance[]> {
        return this.http.get<unknown>(this.BASE_URL).pipe(
            map(data => array(EvaluationInstanceZ).parse(data)),
        )
    }

    postPlan$(plan: EvaluationInstanceBase): Observable<EvaluationInstance> {
        return this.http.post<unknown>(this.BASE_URL, plan).pipe(
            map(data => EvaluationInstanceZ.parse(data)),
        )
    }
}