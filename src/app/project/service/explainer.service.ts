import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { IHTTPData } from "src/app/shared/domain/http-data.interface";
import { Explainer } from "src/app/global_specification/domain/services";


@Injectable()
export class ProjectExplainerServicesService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "services/explainer/";

    
    get$(): Observable<Explainer[]> {

        return this.http.get<IHTTPData<Explainer[]>>(this.BASE_URL).pipe(
            map(({data}) => data),
        )
    }

}