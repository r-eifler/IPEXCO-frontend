import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map, tap } from "rxjs/operators";
import { IHTTPData } from "src/app/interface/http-data.interface";
import { Message } from "../domain/message";
import { AllTranslatorsResponse, BackendLLMResponse } from "../interfaces/translators_interfaces";
@Injectable()
export class LLMService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "llm/";

    
    postMessage$(messages: Message[] ): Observable<string> {
        console.log(messages);
        return this.http.post<IHTTPData<string>>(this.BASE_URL + "simple", { data: messages }).pipe(
            map(({ data }) => data),
            tap(console.log)
        );
    }
    
    postMessageGT$(request: string, threadId: string): Observable<BackendLLMResponse> {
        console.log(request);
        return this.http.post<IHTTPData<BackendLLMResponse>>(this.BASE_URL + 'gt', { data: request, threadId: threadId }).pipe(
            map(({ data }) => data),
            tap(console.log)
        );
    }

    postMessageQT$(request: string, threadId: string): Observable<BackendLLMResponse> {
        console.log(request);
        return this.http.post<IHTTPData<BackendLLMResponse>>(this.BASE_URL + 'qt', { data: request, threadId: threadId }).pipe(
            map(({ data }) => data),
            tap(console.log)
        );
    }

    postMessageET$(request: string, threadId: string): Observable<BackendLLMResponse> {
        console.log(request);
        return this.http.post<IHTTPData<BackendLLMResponse>>(this.BASE_URL + 'et', { data: request, threadId: threadId }).pipe(
            map(({ data }) => data),
            tap(console.log)
        );
    }

    postMessageAllTranslators$(qtRequest: string, gtRequest: string, etRequest: string, threadIdQt: string, threadIdGt: string, threadIdEt: string): Observable<AllTranslatorsResponse> {
        console.log(qtRequest, gtRequest, etRequest);
        return this.http.post<IHTTPData<AllTranslatorsResponse>>(this.BASE_URL + 'translate-all', { qtRequest, gtRequest, etRequest, threadIdQt, threadIdGt, threadIdEt }).pipe(
            map(({ data }) => data),
            tap(console.log)
        );
    }
}
