import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { IHTTPData } from "src/app/shared/domain/http-data.interface";
import { Prompt } from "../domain/prompt";


@Injectable()
export class PromptsService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "prompts/";

    
    get$(): Observable<Prompt[]> {

        return this.http.get<IHTTPData<Prompt[]>>(this.BASE_URL).pipe(
            map(({data}) => data),
        )
    }

    post$(prompt: Prompt): Observable<string | null> {
        return this.http.post<IHTTPData<string | null>>(this.BASE_URL, {data: prompt}).pipe(
            map(({data}) => data)
        )
    }


    put$(prompt: Prompt): Observable<Prompt> {
      return this.http.put<IHTTPData<Prompt>>(this.BASE_URL + prompt._id, {data: prompt}).pipe(
          map(({data}) => data)
      )
    }

    delete$(id: string): Observable<boolean> {
      return this.http.delete<IHTTPData<boolean>>(this.BASE_URL + id).pipe(
          map(({data}) => data)
      )
    }
}