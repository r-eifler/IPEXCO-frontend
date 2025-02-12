import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Demo } from "src/app/project/domain/demo";
import { IHTTPData } from "src/app/shared/domain/http-data.interface";
import { environment } from "src/environments/environment";

@Injectable()
export class UserStudyExecutionDemoService {

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "demo/";

    getDemo$(id: string): Observable<Demo> {
        return this.http.get<IHTTPData<Demo>>(this.BASE_URL + id).pipe(
            map(({data}) => data),
        )
    }

}
