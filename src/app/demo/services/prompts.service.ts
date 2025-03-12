import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { IHTTPData } from "src/app/shared/domain/http-data.interface";
import { OutputSchema, Prompt } from "src/app/global_specification/domain/prompt";


@Injectable()
export class DemoPromptsService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "llm-spec/";

    
    getPrompts$(): Observable<Prompt[]> {

        return this.http.get<IHTTPData<Prompt[]>>(this.BASE_URL + 'prompt').pipe(
            map(({data}) => data),
        )
    }


    getOutputSchemas$(): Observable<OutputSchema[]> {

        return this.http.get<IHTTPData<OutputSchema[]>>(this.BASE_URL + 'output-schema').pipe(
            map(({data}) => data),
        )
    }

}