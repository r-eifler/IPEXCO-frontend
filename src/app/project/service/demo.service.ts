import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Project } from "../domain/project";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map, tap } from "rxjs/operators";
import { IHTTPData } from "src/app/shared/domain/http-data.interface";
import { Demo } from "src/app/demo/domain/demo";
import { PlanProperty } from "src/app/shared/domain/plan-property/plan-property";

@Injectable()
export class DemoService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "demo/";

    getDemo$(id: string): Observable<Demo> {

      return this.http.get<IHTTPData<Demo>>(this.BASE_URL + id).pipe(
          map(({data}) => data),
          map(demo => ({
              ...demo, 
              baseTask : {
                ...demo.baseTask,
                model: JSON.parse(demo.baseTask.model as unknown as string),
                },
              domainSpecification: JSON.parse(demo.domainSpecification as unknown as string),
              globalExplanation : demo.globalExplanation ? {
                ...demo.globalExplanation,
                MUGS: demo.globalExplanation.MUGS ? JSON.parse(demo.globalExplanation.MUGS as unknown as string) : undefined,
                MGCS: demo.globalExplanation.MGCS ? JSON.parse(demo.globalExplanation.MGCS as unknown as string) : undefined,
              } : undefined
          }))
      )
    }

    getDemos$(projectId: string): Observable<Demo[]> {

        console.log("Demo service: getDemos");
        let httpParams = new HttpParams();
        httpParams = httpParams.set('projectId', projectId);

        return this.http.get<IHTTPData<Demo[]>>(this.BASE_URL + 'demos/', { params: httpParams }).pipe(
            map(({data}) => data),
            tap(console.log),
            map(demos => (
              demos.map( demo => ({
                ...demo, 
                baseTask : {
                    ...demo.baseTask,
                    model: JSON.parse(demo.baseTask.model as unknown as string),
                },
                domainSpecification: JSON.parse(demo.domainSpecification as unknown as string),
                globalExplanation : demo.globalExplanation ? {
                  ...demo.globalExplanation,
                  MUGS: demo.globalExplanation.MUGS ? JSON.parse(demo.globalExplanation.MUGS as unknown as string) : undefined,
                  MGCS: demo.globalExplanation.MGCS ? JSON.parse(demo.globalExplanation.MGCS as unknown as string) : undefined,
                } : undefined
              })
            )),
        ))
    }

    postDemo$(demo: Demo, properties: PlanProperty[]): Observable<string | null> {
        console.log('demo service: POST');
        return this.http.post<IHTTPData<string | null>>(this.BASE_URL, {demo: demo, planProperties: properties}).pipe(
            map(({data}) => data)
        )
    }

    putDemo$(demo: Demo): Observable<Demo> {
      console.log(demo);
      return this.http.put<IHTTPData<Demo>>(this.BASE_URL + demo._id, {demo: demo}).pipe(
          map(({data}) => data)
      )
  }
}