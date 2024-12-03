import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Project } from "../domain/project";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { IHTTPData } from "src/app/shared/domain/http-data.interface";
import { Demo } from "src/app/demo/domain/demo";

@Injectable()
export class DemoService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "demo/";

    getDemo$(id: string): Observable<Demo> {

      return this.http.get<IHTTPData<Demo>>(this.BASE_URL + id).pipe(
          map(({data}) => data),
          map(demo => ({
              ...demo, 
              baseTask: JSON.parse(demo.baseTask as unknown as string),
              domainSpecification: JSON.parse(demo.domainSpecification as unknown as string)
          }))
      )
    }

    getDemos$(projectId: string): Observable<Demo[]> {

        let httpParams = new HttpParams();
        httpParams = httpParams.set('projectId', projectId);

        return this.http.get<IHTTPData<Demo[]>>(this.BASE_URL, { params: httpParams }).pipe(
            map(({data}) => data),
            map(demos => (
              demos.map( demo => ({
                ...demo, 
                baseTask: JSON.parse(demo.baseTask as unknown as string),
                domainSpecification: JSON.parse(demo.domainSpecification as unknown as string)
              })
            ))
        ))
    }

    postDemo$(demo: Demo): Observable<boolean> {
        return this.http.put<IHTTPData<boolean>>(this.BASE_URL + demo.projectId, {data: demo}).pipe(
            map(({data}) => data)
        )
    }
}