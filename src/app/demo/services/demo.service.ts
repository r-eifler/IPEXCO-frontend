import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DomainSpecification } from "src/app/global_specification/domain/domain_specification";
import { Demo } from "src/app/project/domain/demo";
import { IHTTPData } from "src/app/shared/domain/http-data.interface";
import { PlanProperty } from "src/app/shared/domain/plan-property/plan-property";
import { environment } from "src/environments/environment";

@Injectable()
export class DemoService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "demo/";

    getDemo$(id: string): Observable<Demo> {

      return this.http.get<IHTTPData<Demo>>(this.BASE_URL + id).pipe(
          map(({data}) => data),
      )
    }

    getDemos$(): Observable<Demo[]> {

        return this.http.get<IHTTPData<Demo[]>>(this.BASE_URL).pipe(
            map(({data}) => data),
        );
    }

    postDemo$(demo: Demo, properties: PlanProperty[], domainSpecification: DomainSpecification): Observable<string | null> {
        return this.http.post<IHTTPData<string | null>>(this.BASE_URL + 'upload', {
            demo: demo, 
            planProperties: properties,
            domainSpecification
        }).pipe(
            map(({data}) => data)
        )
    }

    postDemoImage$(image: any): Observable<string | null> {
      const formData = new FormData();
      formData.append('summaryImage', image);

      return this.http.post<IHTTPData<string | null>>(this.BASE_URL + 'image', formData).pipe(
          map(({data}) => data)
      )
  }

    putDemo$(demo: Demo): Observable<Demo> {
      return this.http.put<IHTTPData<Demo>>(this.BASE_URL + demo._id, {demo: demo}).pipe(
          map(({data}) => data)
      )
    }

    deleteDemo$(id: string): Observable<boolean> {
      return this.http.delete<IHTTPData<boolean>>(this.BASE_URL + id).pipe(
          map(({data}) => data)
      )
    }
}