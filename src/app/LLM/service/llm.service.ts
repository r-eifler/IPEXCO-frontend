import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map, tap } from "rxjs/operators";
import { IHTTPData } from "src/app/interface/http-data.interface";
import { Message } from "../domain/message";


@Injectable()
export class LLMService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "llm/";

    postMessage$(messages: Message[]): Observable<string> {
        console.log(messages)
        return this.http.post<IHTTPData<string>>(this.BASE_URL + 'simple', {data: messages}).pipe(
            map(({data}) => data),
            tap(console.log)
        )

    }
}