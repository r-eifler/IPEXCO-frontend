import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { IHTTPData } from "src/app/shared/domain/http-data.interface";
import { environment } from "src/environments/environment";


@Injectable()
export class ExplainerService{
    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "explainer/explain-step/";

    postComputeGlobalExplanation$(stepId: string): Observable<boolean> {

        console.log('ExplainerService')
        
        return this.http.post<IHTTPData<boolean>>(this.BASE_URL + stepId, {}).pipe(
            map(({data}) => data)
        )

    }

}
