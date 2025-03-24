import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { boolean } from "zod";


@Injectable()
export class ExplainerService{
    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "explainer/explain-step/";

    postComputeGlobalExplanation$(stepId: string): Observable<boolean> {
        
        return this.http.post<unknown>(this.BASE_URL + stepId, {}).pipe(
            map((data) => boolean().parse(data))
        )

    }

}
