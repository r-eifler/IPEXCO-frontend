import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { OutputSchema, OutputSchemaZ, Prompt, PromptZ } from "src/app/global_specification/domain/prompt";
import { environment } from "src/environments/environment";
import { array } from "zod";


@Injectable()
export class ProjectPromptsService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "llm-spec/";

    
    getPrompts$(): Observable<Prompt[]> {
        return this.http.get<unknown>(this.BASE_URL + 'prompt').pipe(
            map(data => array(PromptZ).parse(data)),
        )
    }


    getOutputSchemas$(): Observable<OutputSchema[]> {
        return this.http.get<unknown>(this.BASE_URL + 'output-schema').pipe(
            map(data => array(OutputSchemaZ).parse(data)),
        )
    }

}