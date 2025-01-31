import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map, tap } from "rxjs/operators";
import { IHTTPData } from "src/app/shared/domain/http-data.interface";
import { DomainSpecification } from "src/app/global_specification/domain/domain_specification";

@Injectable()
export class MetaProjectDomainSpecificationService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "domain-spec/";

    
    get$(): Observable<DomainSpecification[]> {

        return this.http.get<IHTTPData<DomainSpecification[]>>(this.BASE_URL).pipe(
            map(({data}) => data)
        )
    }


}