import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Project, ProjectBase, ProjectZ } from "src/app/shared/domain/project";
import { environment } from "src/environments/environment";


@Injectable()
export class CreateProjectService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "project/";

    postProject$(project: ProjectBase): Observable<Project> {

        return this.http.post<unknown>(this.BASE_URL,project).pipe(
            map(data => ProjectZ.parse(data)),
        )
    }
}