import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Service, ServiceZ } from "src/app/global_specification/domain/services";
import { environment } from "src/environments/environment";
import { array } from "zod";


@Injectable()
export class BelugaProjectServicesService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "services/";

    
    get$(): Observable<Service[]> {
        return this.http.get<unknown>(this.BASE_URL).pipe(
            tap(data => console.log(data)),
            map(data => array(ServiceZ).parse(data)),
        )
    }
}