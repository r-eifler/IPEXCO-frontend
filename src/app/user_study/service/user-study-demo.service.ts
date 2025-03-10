import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Demo, DemoZ } from "src/app/shared/domain/demo";
import { environment } from "src/environments/environment";
import { array } from "zod";

@Injectable()
export class UserStudyDemoService {

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "demo/";

    getDemo$(id: string): Observable<Demo> {
		return this.http.get<unknown>(this.BASE_URL + id).pipe(
			map((data) => DemoZ.parse(data)),
		)
	}


	getAllDemos$(): Observable<Demo[]> {

		return this.http.get<unknown>(this.BASE_URL + 'user-study/').pipe(
			map((data) => array(DemoZ).parse(data)),
		)
	}
}
