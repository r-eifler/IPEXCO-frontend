import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { IHTTPData } from "src/app/interface/http-data.interface";
import { Question } from "../domain/explanation/explanations";



@Injectable()
export class ExplainerService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "explainer/explain-step/";

    postComputeExplanation$(stepId: string, question: Question): Observable<boolean> {

        return this.http.post<IHTTPData<boolean>>(this.BASE_URL + stepId, {data: question}).pipe(
            map(({data}) => data)
        )

    }

    postComputeGlobalExplanation$(stepId: string): Observable<boolean> {

        return this.http.post<IHTTPData<boolean>>(this.BASE_URL + stepId, {}).pipe(
            map(({data}) => data)
        )

    }

}