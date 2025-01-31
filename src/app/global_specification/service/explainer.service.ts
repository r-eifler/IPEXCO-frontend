import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { IHTTPData } from "src/app/shared/domain/http-data.interface";
import { Explainer } from "../domain/services";


@Injectable()
export class ExplainerServicesService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "services/explainer/";

    
    get$(): Observable<Explainer[]> {

        return this.http.get<IHTTPData<Explainer[]>>(this.BASE_URL).pipe(
            map(({data}) => data),
        )
    }

    post$(explainer: Explainer): Observable<Explainer | null> {
        return this.http.post<IHTTPData<Explainer | null>>(this.BASE_URL, {data: explainer}).pipe(
            map(({data}) => data)
        )
    }


    put$(explainer: Explainer): Observable<Explainer> {
      return this.http.put<IHTTPData<Explainer>>(this.BASE_URL + explainer._id, {data: explainer}).pipe(
          map(({data}) => data)
      )
    }

    delete$(id: string): Observable<boolean> {
      return this.http.delete<IHTTPData<boolean>>(this.BASE_URL + id).pipe(
          map(({data}) => data)
      )
    }
}