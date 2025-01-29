import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map, tap } from "rxjs/operators";
import { IHTTPData } from "src/app/shared/domain/http-data.interface";
import { DomainSpecification } from "../domain/domain_specification";

@Injectable()
export class DomainSpecificationService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "domain-spec/";

    
    get$(): Observable<DomainSpecification[]> {

        return this.http.get<IHTTPData<DomainSpecification[]>>(this.BASE_URL).pipe(
            map(({data}) => data),
            map(specs => (
              specs.map( spec => ({
                ...spec, 
                planPropertyTemplates: spec.planPropertyTemplates && spec.planPropertyTemplates.length > 0 ? JSON.parse(spec.planPropertyTemplates as unknown as string) : []
              })
            )),
        ))
    }

    post$(spec: DomainSpecification): Observable<DomainSpecification | null> {
        return this.http.post<IHTTPData<DomainSpecification | null>>(this.BASE_URL, {data: spec}).pipe(
            map(({data}) => data)
        )
    }


    put$(spec: DomainSpecification): Observable<DomainSpecification> {
      return this.http.put<IHTTPData<DomainSpecification>>(this.BASE_URL + spec._id, {data: spec}).pipe(
          map(({data}) => data)
      )
    }

    delete$(id: string): Observable<boolean> {
      return this.http.delete<IHTTPData<boolean>>(this.BASE_URL + id).pipe(
          map(({data}) => data)
      )
    }
}