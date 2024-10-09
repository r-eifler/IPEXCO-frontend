import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map, tap } from "rxjs/operators";
import { IHTTPData } from "src/app/interface/http-data.interface";
import { Message } from "../domain/message";
import { TranslationHistory } from "../translators_interfaces";

@Injectable()
export class LLMService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "llm/";

    
    postMessage$(messages: Message[] | TranslationHistory, endpoint: string): Observable<string> {
        endpoint = endpoint ?? 'simple';
        endpoint = 'qt'
        console.log(messages);
        return this.http.post<IHTTPData<string>>(this.BASE_URL + endpoint, { data: messages }).pipe(
            map(({ data }) => data),
            tap(console.log)
        );
    }
}