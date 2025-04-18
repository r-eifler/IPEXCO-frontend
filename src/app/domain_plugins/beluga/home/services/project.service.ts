import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Project, ProjectZ } from "src/app/shared/domain/project";
import { environment } from "src/environments/environment";
import { array, boolean } from "zod";


@Injectable()
export class ProjectService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "project/";

    getProjectList$(): Observable<Project[]> {
        return this.http.get<unknown>(this.BASE_URL).pipe(
            map((data) => array(ProjectZ).parse(data)),
        )
    }

    deleteProject$(id: string): Observable<boolean> {
        return this.http.delete<unknown>(this.BASE_URL + '/' + id).pipe(
            map((data) => boolean().parse(data)),
        )
    }
}