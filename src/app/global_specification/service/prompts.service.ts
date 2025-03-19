import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { array, boolean } from "zod";
import { OutputSchema, OutputSchemaZ, Prompt, PromptZ } from "../domain/prompt";


@Injectable()
export class PromptsService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "llm-spec/";


    // LLM prompts
    
    getPrompts$(): Observable<Prompt[]> {
        return this.http.get<unknown>(this.BASE_URL + 'prompt').pipe(
            map(data => array(PromptZ).parse(data)),
        )
    }

    getPrompt$(id: string): Observable<Prompt> {

        return this.http.get<unknown>(this.BASE_URL + 'prompt/' + id).pipe(
            map(data => PromptZ.parse(data)),
        )
    }

    postPrompt$(prompt: Prompt): Observable<Prompt> {
        return this.http.post<unknown>(this.BASE_URL + 'prompt', prompt).pipe(
            map(data => PromptZ.parse(data)),
        )
    }


    putPrompt$(prompt: Prompt): Observable<Prompt> {
      return this.http.put<unknown>(this.BASE_URL  + 'prompt/' + prompt._id, prompt).pipe(
        map(data => PromptZ.parse(data)),
      )
    }

    deletePrompt$(id: string): Observable<boolean> {
		return this.http.delete<unknown>(this.BASE_URL  + 'prompt/' + id).pipe(
			map(data => boolean().parse(data)),
		)
    }


    // Output Schemas

    getOutputSchemas$(): Observable<OutputSchema[]> {
        return this.http.get<unknown>(this.BASE_URL + 'output-schema').pipe(
            map(data => array(OutputSchemaZ).parse(data)),
        )
    }

    getOutputSchema$(id: string): Observable<OutputSchema> {

        return this.http.get<unknown>(this.BASE_URL + 'output-schema/' + id).pipe(
            map(data => OutputSchemaZ.parse(data)),
        )
    }

    postOutputSchema$(schema: OutputSchema): Observable<OutputSchema> {
        return this.http.post<unknown>(this.BASE_URL + 'output-schema', schema).pipe(
            map(data => OutputSchemaZ.parse(data)),
        )
    }

    putOutputSchema$(schema: OutputSchema): Observable<OutputSchema> {
      return this.http.put<unknown>(this.BASE_URL  + 'output-schema/' + schema._id, schema).pipe(
        map(data => OutputSchemaZ.parse(data)),
      )
    }

    deleteOutputSchema$(id: string): Observable<boolean> {
		return this.http.delete<unknown>(this.BASE_URL  + 'output-schema/' + id).pipe(
			map(data => boolean().parse(data)),
		)
    }
}