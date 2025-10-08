import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { array, boolean, string } from "zod";
import { IterationStep, IterationStepBase, IterationStepZ } from "../domain/iteration_step";


@Injectable()
export class IterationStepService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "iteration-step/";

    getIterationSteps$(id: string): Observable<IterationStep[]> {

        let httpParams = new HttpParams();
        httpParams = httpParams.set('projectId', id);
        
        return this.http.get<unknown>(this.BASE_URL,  { params: httpParams }).pipe(
            map((data) => array(IterationStepZ).parse(data))
          )
    }

    postIterationStep$(iterationStep: IterationStepBase): Observable<IterationStep> {
        return this.http.post<unknown>(this.BASE_URL, iterationStep).pipe(
            map((data) => IterationStepZ.parse(data))
        )
    }

    postCancelIterationStep$(iterationStepId: string): Observable<boolean> {
        return this.http.post<unknown>(this.BASE_URL + 'cancel', {id: iterationStepId}).pipe(
            map((data) => boolean().parse(data))
        )
    }

    putIterationStep$(iterationStep: IterationStep): Observable<IterationStep> {
        return this.http.put<unknown>(this.BASE_URL + iterationStep._id, iterationStep).pipe(
            map((data) => IterationStepZ.parse(data))
        )
    }

    deleteIterationStep$(id: string): Observable<boolean> {
        return this.http.delete<unknown>(this.BASE_URL + id).pipe(
            map((data) => boolean().parse(data))
        )
    }
}