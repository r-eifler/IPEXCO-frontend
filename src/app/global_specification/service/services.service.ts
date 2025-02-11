import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map, tap } from "rxjs/operators";
import { IHTTPData } from "src/app/shared/domain/http-data.interface";
import { Service } from "../domain/services";


@Injectable()
export class ServicesService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "services/";

    
    get$(): Observable<Service[]> {

        return this.http.get<IHTTPData<Service[]>>(this.BASE_URL).pipe(
            map(({data}) => data),
        )
    }

    post$(planner: Service): Observable<Service | null> {
        return this.http.post<IHTTPData<Service | null>>(this.BASE_URL, {data: planner}).pipe(
            map(({data}) => data)
        )
    }


    put$(planner: Service): Observable<Service> {
      return this.http.put<IHTTPData<Service>>(this.BASE_URL + planner._id, {data: planner}).pipe(
          map(({data}) => data)
      )
    }

    delete$(id: string): Observable<boolean> {
      return this.http.delete<IHTTPData<boolean>>(this.BASE_URL + id).pipe(
          map(({data}) => data)
      )
    }
}