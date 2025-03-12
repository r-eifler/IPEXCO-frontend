import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map, tap } from "rxjs/operators";
import { IHTTPData } from "src/app/shared/domain/http-data.interface";
import { Service } from "src/app/global_specification/domain/services";


@Injectable()
export class DemoServicesService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "services/";

    
    get$(): Observable<Service[]> {

        return this.http.get<IHTTPData<Service[]>>(this.BASE_URL).pipe(
            map(({data}) => data),
        )
    }
}