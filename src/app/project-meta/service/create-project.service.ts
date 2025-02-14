import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { IHTTPData } from "src/app/shared/domain/http-data.interface";
import { Project, ProjectBase } from "src/app/shared/domain/project";


@Injectable()
export class CreateProjectService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "project/";

    postProject$(project: ProjectBase): Observable<Project> {

        return this.http.post<IHTTPData<Project>>(this.BASE_URL, {data: project}).pipe(
            map(({data}) => data),
        )
    }
}