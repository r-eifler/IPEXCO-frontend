import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { IHTTPData } from "src/app/shared/domain/http-data.interface";
import { Project } from "src/app/shared/domain/project";


@Injectable()
export class CreateProjectService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "project/";

    postProject$(project: Project): Observable<Project> {

        return this.http.post<IHTTPData<Project>>(this.BASE_URL, {data: project}).pipe(
            map(({data}) => data),
            // map(l => l.map(project => ({
            //     ...project, 
            //     baseTask: JSON.parse(project.baseTask as unknown as string)
            // })))
        )

        // return this.http.get<{ data: unknown }>(this.BASE_URL).pipe(
        //     map(({data}) => array(ProjectSchema).parse(data)),
        // )
    }
}