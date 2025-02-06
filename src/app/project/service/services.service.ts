import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Service } from "src/app/global_specification/domain/services";
import { IHTTPData } from "src/app/shared/domain/http-data.interface";
import { environment } from "src/environments/environment";


@Injectable()
export class ProjectServicesService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "services/";

    
    get$(): Observable<Service[]> {

        return this.http.get<IHTTPData<Service[]>>(this.BASE_URL).pipe(
            map(({data}) => data),
        )
    }
}