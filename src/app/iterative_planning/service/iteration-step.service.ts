import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { IHTTPData } from "src/app/interface/http-data.interface";
import { IterationStep } from "../domain/iteration_step";


@Injectable()
export class IterationStepService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "iteration-step/";

    getIterationSteps$(id: string): Observable<IterationStep[]> {

        let httpParams = new HttpParams();
        httpParams = httpParams.set('projectId', id);
        
        return this.http.get<IHTTPData<IterationStep[]>>(this.BASE_URL,  { params: httpParams }).pipe(
            map(({data}) => data)
        )
    }

    postIterationStep$(iterationStep: IterationStep): Observable<IterationStep> {

        return this.http.post<IHTTPData<IterationStep>>(this.BASE_URL, {data: iterationStep}).pipe(
            map(({data}) => data)
        )

    }

    putIterationStep$(iterationStep: IterationStep): Observable<IterationStep> {

        return this.http.put<IHTTPData<IterationStep>>(this.BASE_URL + iterationStep._id, {data: iterationStep}).pipe(
            map(({data}) => data)
        )

    }

    deleteIterationStep$(id: string): Observable<boolean> {

        return this.http.delete<IHTTPData<boolean>>(this.BASE_URL + id).pipe(
            map(({data}) => data)
        )

    }
}