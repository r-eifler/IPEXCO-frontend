import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Project } from "../domain/project";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { IHTTPData } from "src/app/interface/http-data.interface";
import { array, date, object, string, infer as zInfer } from "zod";

// const PlanningTaskUnverifiedSchema = string().transform(s => JSON.parse(s));

// const PlanningTaskSchema = object({
//     name: string(),
// })

// const ProjectSchema =   (object({
//     _id: string(),
//     update: date(),
//     baseTask: PlanningTaskUnverifiedSchema.pipe(PlanningTaskSchema)
// });

// type Project = zInfer<typeof ProjectSchema>;


@Injectable()
export class ProjectService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "project/";

    getProject$(id: string): Observable<Project> {

        return this.http.get<IHTTPData<Project>>(this.BASE_URL + id).pipe(
            map(({data}) => data),
            map(project => ({
                ...project, 
                baseTask: JSON.parse(project.baseTask as unknown as string),
                domainSpecification: JSON.parse(project.domainSpecification as unknown as string)
            }))
        )

        // return this.http.get<{ data: unknown }>(this.BASE_URL).pipe(
        //     map(({data}) => array(ProjectSchema).parse(data)),
        // )
    }

    putProject$(project: Project): Observable<Project> {

        return this.http.put<IHTTPData<Project>>(this.BASE_URL + project._id, {data: project}).pipe(
            map(({data}) => data),
            map(project => ({
                ...project, 
                baseTask: JSON.parse(project.baseTask as unknown as string)
            }))
        )

        // return this.http.get<{ data: unknown }>(this.BASE_URL).pipe(
        //     map(({data}) => array(ProjectSchema).parse(data)),
        // )
    }
}