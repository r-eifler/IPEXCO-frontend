import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { ProjectMetaData, ProjectMetaZ } from "src/app/project-meta/domain/project-meta";
import { environment } from "src/environments/environment";
import { array, boolean } from "zod";


@Injectable()
export class ProjectMetaDataService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "project/meta-data";

    getProjectList$(): Observable<ProjectMetaData[]> {
        return this.http.get<unknown>(this.BASE_URL).pipe(
            map((data) => array(ProjectMetaZ).parse(data)),
        )
    }

    deleteProject$(id: string): Observable<boolean> {
        return this.http.delete<unknown>(this.BASE_URL + '/' + id).pipe(
            map((data) => boolean().parse(data)),
        )
    }
}