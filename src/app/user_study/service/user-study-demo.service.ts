import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Demo } from "src/app/shared/domain/demo";
import { IHTTPData } from "src/app/shared/domain/http-data.interface";
import { PlanProperty } from "src/app/shared/domain/plan-property/plan-property";
import { environment } from "src/environments/environment";

@Injectable()
export class UserStudyDemoService {

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "demo/";

    getDemo$(id: string): Observable<Demo> {

		return this.http.get<IHTTPData<Demo>>(this.BASE_URL + id).pipe(
			map(({data}) => data),
		)
    }


	getAllDemos$(): Observable<Demo[]> {

		return this.http.get<IHTTPData<Demo[]>>(this.BASE_URL + 'user-study/').pipe(
		map(({data}) => data),
		)
	}

    getDemos$(projectId: string): Observable<Demo[]> {

        let httpParams = new HttpParams();
        httpParams = httpParams.set('projectId', projectId);

        return this.http.get<IHTTPData<Demo[]>>(this.BASE_URL + 'demos/', { params: httpParams }).pipe(
            map(({data}) => data),
        )
    }

    postDemo$(demo: Demo, properties: PlanProperty[]): Observable<string | null> {
        return this.http.post<IHTTPData<string | null>>(this.BASE_URL, {demo: demo, planProperties: properties}).pipe(
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
