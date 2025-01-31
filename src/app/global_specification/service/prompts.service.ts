import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { IHTTPData } from "src/app/shared/domain/http-data.interface";
import { OutputSchema, Prompt } from "../domain/prompt";


@Injectable()
export class PromptsService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "llm-spec/";

    
    getPrompts$(): Observable<Prompt[]> {

        return this.http.get<IHTTPData<Prompt[]>>(this.BASE_URL + 'prompt').pipe(
            map(({data}) => data),
        )
    }

    getPrompt$(id: string): Observable<Prompt> {

        return this.http.get<IHTTPData<Prompt>>(this.BASE_URL + 'prompt/' + id).pipe(
            map(({data}) => data),
        )
    }

    postPrompt$(prompt: Prompt): Observable<Prompt | null> {
        return this.http.post<IHTTPData<Prompt | null>>(this.BASE_URL + 'prompt', {data: prompt}).pipe(
            map(({data}) => data)
        )
    }


    putPrompt$(prompt: Prompt): Observable<Prompt> {
      return this.http.put<IHTTPData<Prompt>>(this.BASE_URL  + 'prompt/' + prompt._id, {data: prompt}).pipe(
          map(({data}) => data)
      )
    }

    deletePrompt$(id: string): Observable<boolean> {
      return this.http.delete<IHTTPData<boolean>>(this.BASE_URL  + 'prompt/' + id).pipe(
          map(({data}) => data)
      )
    }

    getOutputSchemas$(): Observable<OutputSchema[]> {

        return this.http.get<IHTTPData<OutputSchema[]>>(this.BASE_URL + 'output-schema').pipe(
            map(({data}) => data),
        )
    }

    getOutputSchema$(id: string): Observable<OutputSchema> {

        return this.http.get<IHTTPData<OutputSchema>>(this.BASE_URL + 'output-schema/' + id).pipe(
            map(({data}) => data),
        )
    }

    postOutputSchema$(prompt: OutputSchema): Observable<OutputSchema | null> {
        return this.http.post<IHTTPData<OutputSchema | null>>(this.BASE_URL + 'output-schema', {data: prompt}).pipe(
            map(({data}) => data)
        )
    }


    putOutputSchema$(prompt: OutputSchema): Observable<OutputSchema> {
      return this.http.put<IHTTPData<OutputSchema>>(this.BASE_URL  + 'output-schema/' + prompt._id, {data: prompt}).pipe(
          map(({data}) => data)
      )
    }

    deleteOutputSchema$(id: string): Observable<boolean> {
      return this.http.delete<IHTTPData<boolean>>(this.BASE_URL  + 'output-schema/'+ id).pipe(
          map(({data}) => data)
      )
    }
}