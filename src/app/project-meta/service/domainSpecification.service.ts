import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DomainSpecification, DomainSpecificationZ } from "src/app/global_specification/domain/domain_specification";
import { environment } from "src/environments/environment";
import { array } from "zod";

@Injectable()
export class MetaProjectDomainSpecificationService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "domain-spec/";

    
    get$(): Observable<DomainSpecification[]> {
        return this.http.get<unknown>(this.BASE_URL).pipe(
            map((data => array(DomainSpecificationZ).parse(data))),
        )
    }


}