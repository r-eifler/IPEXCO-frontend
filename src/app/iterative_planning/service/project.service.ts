import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Project, ProjectZ } from "src/app/shared/domain/project";
import { environment } from "src/environments/environment";


@Injectable()
export class IterativePlanningProjectService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "project/";

    getProject$(id: string): Observable<Project> {
        return this.http.get<unknown>(this.BASE_URL + id).pipe(
            map(data => ProjectZ.parse(data)),
        )
    }

    putProject$(project: Project): Observable<Project> {
        return this.http.put<unknown>(this.BASE_URL + project._id, project).pipe(
            map(data => ProjectZ.parse(data)),
        )
    }
}