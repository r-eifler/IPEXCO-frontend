import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DomainSpecification } from "src/app/global_specification/domain/domain_specification";
import { Demo, DemoBase, DemoZ } from "src/app/shared/domain/demo";
import { PlanProperty } from "src/app/shared/domain/plan-property/plan-property";
import { environment } from "src/environments/environment";
import { array, boolean, string } from "zod";

@Injectable()
export class DemoService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "demo/";

    getDemo$(id: string): Observable<Demo> {
        return this.http.get<unknown>(this.BASE_URL + id).pipe(
            map((data) => DemoZ.parse(data)),
        )
    }

    getDemos$(): Observable<Demo[]> {
        return this.http.get<unknown>(this.BASE_URL).pipe(
            map((data) => array(DemoZ).parse(data)),
        );
    }

    postDemo$(demo: Demo, properties: PlanProperty[], domainSpec: DomainSpecification): Observable<string> {

        const demoData = {
            demo: demo, 
            planProperties: properties,
            domainSpecification: domainSpec
        }

        return this.http.post<unknown>(this.BASE_URL + 'upload', demoData).pipe(
            map(data => string().parse(data))
        )
    }

    postDemoImage$(image: any): Observable<Demo> {
        const formData = new FormData();
        formData.append('summaryImage', image);

        return this.http.post<unknown>(this.BASE_URL + 'image', formData).pipe(
            map((data) => DemoZ.parse(data)),
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