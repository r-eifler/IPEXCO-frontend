import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map, tap } from "rxjs/operators";
import { IHTTPData } from "src/app/shared/domain/http-data.interface";
import { Demo } from "src/app/project/domain/demo";
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

    getDemos$(): Observable<Demo[]> {

        return this.http.get<IHTTPData<Demo[]>>(this.BASE_URL).pipe(
            map(({data}) => data),
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
        return this.http.post<IHTTPData<string | null>>(this.BASE_URL + 'upload', {demo: demo, planProperties: properties}).pipe(
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