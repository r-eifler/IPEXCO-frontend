import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { array, boolean } from "zod";
import { DomainSpecification, DomainSpecificationZ } from "../domain/domain_specification";

@Injectable()
export class DomainSpecificationService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "domain-spec/";

    
    get$(): Observable<DomainSpecification[]> {
        return this.http.get<unknown>(this.BASE_URL).pipe(
            map((data => array(DomainSpecificationZ).parse(data))),
        )
    }

    getById$(id: string): Observable<DomainSpecification> {
      return this.http.get<unknown>(this.BASE_URL + id).pipe(
            map((data => DomainSpecificationZ.parse(data))),
      )
    }

    post$(spec: DomainSpecification): Observable<DomainSpecification> {
        return this.http.post<unknown>(this.BASE_URL, spec).pipe(
            map((data => DomainSpecificationZ.parse(data))),
        )
    }

    put$(spec: DomainSpecification): Observable<DomainSpecification> {
      return this.http.put<unknown>(this.BASE_URL + spec._id, spec).pipe(
        map((data => DomainSpecificationZ.parse(data))),
      )
    }

    delete$(id: string): Observable<boolean> {
      return this.http.delete<unknown>(this.BASE_URL + id).pipe(
        map((data => boolean().parse(data))),
      )
    }
}