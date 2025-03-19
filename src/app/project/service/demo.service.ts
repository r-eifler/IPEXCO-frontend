import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Demo, DemoBase, DemoZ } from "src/app/shared/domain/demo";
import { PlanPropertyBase } from "src/app/shared/domain/plan-property/plan-property";
import { environment } from "src/environments/environment";
import { array, boolean, string } from "zod";

@Injectable({
    providedIn: "root"
})
export class ProjectDemoService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "demo/";

    getDemo$(id: string): Observable<Demo> {
        return this.http.get<unknown>(this.BASE_URL + id).pipe(
            map((data) => DemoZ.parse(data)),
        )
    }

    getDemos$(projectId: string): Observable<Demo[]> {
        let httpParams = new HttpParams();
        httpParams = httpParams.set('projectId', projectId);
        
        return this.http.get<unknown>(this.BASE_URL, { params: httpParams }).pipe(
            map((data) => array(DemoZ).parse(data)),
        );
    }

    postDemo$(demo: DemoBase, properties: PlanPropertyBase[]): Observable<string> {

        const demoData = {
            demo: demo, 
            planProperties: properties,
        }

        return this.http.post<unknown>(this.BASE_URL, demoData).pipe(
            map(data => string().parse(data))
        )
    }

    postCancelDemo$(demoId: string): Observable<boolean> {
        return this.http.post<unknown>(this.BASE_URL + 'cancel', demoId).pipe(
            map(data => boolean().parse(data))
        )
    }

    postDemoImage$(image: any): Observable<string> {
        const formData = new FormData();
        formData.append('summaryImage', image);

        return this.http.post<unknown>(this.BASE_URL + 'image', formData).pipe(
            map((data) => string().parse(data)),
        )
    }

    putDemo$(id: string, demo: DemoBase): Observable<Demo> {
        return this.http.put<unknown>(this.BASE_URL + id, demo).pipe(
            map((data) => DemoZ.parse(data)),
        )
    }

    deleteDemo$(id: string): Observable<boolean> {
        return this.http.delete<unknown>(this.BASE_URL + id).pipe(
            map((data) => boolean().parse(data))
        )
    }
}