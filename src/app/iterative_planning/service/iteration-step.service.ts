import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map, tap } from "rxjs/operators";
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
            map(({data}) => data),
            tap(steps => console.log(steps)),
            map(steps => 
                steps.map( step => (
                {
                    ... step,
                    plan: step?.plan ? {
                            ...step.plan, 
                            cost: undefined,
                            actions: step.plan.actions ? JSON.parse(step.plan.actions as unknown as string) : undefined,
                        } : undefined,
                    task : {
                        ...step.task,
                        model: JSON.parse(step.task.model as unknown as string),
                    },
                    globalExplanation : step.globalExplanation ? {
                        ...step.globalExplanation,
                        MUGS: step.globalExplanation.MUGS ? JSON.parse(step.globalExplanation.MUGS as unknown as string) : undefined,
                        MGCS: step.globalExplanation.MGCS ? JSON.parse(step.globalExplanation.MGCS as unknown as string) : undefined,
                    } : undefined
                }
                ))
            ),
          )
            
    }

    // step?.plan ? {
    //     ...step.plan, 
    //     actions: JSON.parse(step.plan as unknown as string),
    // } :

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