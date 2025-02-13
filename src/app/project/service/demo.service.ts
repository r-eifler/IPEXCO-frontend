import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map, tap } from "rxjs/operators";
import { IHTTPData } from "src/app/shared/domain/http-data.interface";
import { Demo } from "src/app/project/domain/demo";
import { PlanProperty, PlanPropertyBase } from "src/app/shared/domain/plan-property/plan-property";

@Injectable()
export class ProjectDemoService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "demo/";

    getDemo$(id: string): Observable<Demo> {

      return this.http.get<IHTTPData<Demo>>(this.BASE_URL + id).pipe(
          map(({data}) => data),
      )
    }

    getDemos$(projectId: string): Observable<Demo[]> {

        let httpParams = new HttpParams();
        httpParams = httpParams.set('projectId', projectId);

        return this.http.get<IHTTPData<Demo[]>>(this.BASE_URL, { params: httpParams }).pipe(
            map(({data}) => data),
        )
    }

    postDemo$(demo: Demo, properties: PlanPropertyBase[]): Observable<string | null> {
        return this.http.post<IHTTPData<string | null>>(this.BASE_URL, {demo: demo, planProperties: properties}).pipe(
            map(({data}) => data)
        )
    }

    postCancelDemo$(demoId: string): Observable<string | null> {
      return this.http.post<IHTTPData<string | null>>(this.BASE_URL + 'cancel', {demoId}).pipe(
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