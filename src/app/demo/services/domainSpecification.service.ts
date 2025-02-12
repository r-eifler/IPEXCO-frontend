import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DomainSpecification } from "src/app/global_specification/domain/domain_specification";
import { IHTTPData } from "src/app/shared/domain/http-data.interface";
import { environment } from "src/environments/environment";

@Injectable()
export class DemoDomainSpecificationService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "domain-spec/";


    getById$(id: string): Observable<DomainSpecification> {

      return this.http.get<IHTTPData<DomainSpecification>>(this.BASE_URL + id).pipe(
          map(({data}) => data)
      )
  }
}