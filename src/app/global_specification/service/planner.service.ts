import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map, tap } from "rxjs/operators";
import { IHTTPData } from "src/app/shared/domain/http-data.interface";
import { Planner } from "../domain/services";


@Injectable()
export class PlannerServicesService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "services/planner/";

    
    get$(): Observable<Planner[]> {

        return this.http.get<IHTTPData<Planner[]>>(this.BASE_URL).pipe(
            map(({data}) => data),
        )
    }

    post$(planner: Planner): Observable<Planner | null> {
        return this.http.post<IHTTPData<Planner | null>>(this.BASE_URL, {data: planner}).pipe(
            map(({data}) => data)
        )
    }


    put$(planner: Planner): Observable<Planner> {
      return this.http.put<IHTTPData<Planner>>(this.BASE_URL + planner._id, {data: planner}).pipe(
          map(({data}) => data)
      )
    }

    delete$(id: string): Observable<boolean> {
      return this.http.delete<IHTTPData<boolean>>(this.BASE_URL + id).pipe(
          map(({data}) => data)
      )
    }
}