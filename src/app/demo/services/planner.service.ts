import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map, tap } from "rxjs/operators";
import { IHTTPData } from "src/app/shared/domain/http-data.interface";
import { Planner } from "src/app/global_specification/domain/services";


@Injectable()
export class DemoPlannerServicesService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "services/planner/";

    
    get$(): Observable<Planner[]> {

        return this.http.get<IHTTPData<Planner[]>>(this.BASE_URL).pipe(
            map(({data}) => data),
        )
    }
}