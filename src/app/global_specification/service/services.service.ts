import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { z } from "zod";
import { Service, ServiceZ } from "../domain/services";


@Injectable()
export class ServicesService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "services/";

    
    get$(): Observable<Service[]> {
        return this.http.get<Service[]>(this.BASE_URL).pipe(
            map(data => data.map(s => ServiceZ.parse(s))),
        )
    }

    post$(service: Service): Observable<Service> {
        return this.http.post<Service>(this.BASE_URL, service).pipe(
            map(data => ServiceZ.parse(data)),
        )
    }

    put$(service: Service): Observable<Service> {
      return this.http.put<Service>(this.BASE_URL + service._id, service).pipe(
        map(data => ServiceZ.parse(data)),
      )
    }

    delete$(id: string): Observable<boolean> {
      return this.http.delete<boolean>(this.BASE_URL + id).pipe(
        tap(console.log),
        map(data => z.boolean().parse(data)),
      )
    }
}