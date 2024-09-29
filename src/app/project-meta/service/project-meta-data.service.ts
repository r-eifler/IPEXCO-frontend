import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { IHTTPData } from "src/app/interface/http-data.interface";
import { array, date, object, string, infer as zInfer } from "zod";
import { ProjectMetaData } from "../domain/project-meta";

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
export class ProjectMetaDataService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "project/meta-data";

    getProjectList$(): Observable<ProjectMetaData[]> {

        return this.http.get<IHTTPData<ProjectMetaData[]>>(this.BASE_URL).pipe(
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