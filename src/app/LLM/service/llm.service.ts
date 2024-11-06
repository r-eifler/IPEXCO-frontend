import { inject, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { catchError, concatMap, map, tap } from "rxjs/operators";
import { IHTTPData } from "src/app/interface/http-data.interface";
import { Message } from "../domain/message";
import { AllTranslatorsResponse, BackendLLMResponse, QTthenGTResponse } from "../interfaces/translators_interfaces";
import { Question } from "src/app/iterative_planning/domain/interface/question";
@Injectable()
export class LLMService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "llm/";

    
    // postMessage$(messages: Message[] ): Observable<string> {
    //     console.log(messages);
    //     return this.http.post<IHTTPData<string>>(this.BASE_URL + "simple", { data: messages }).pipe(
    //         map(({ data }) => data),
    //         tap(console.log)
    //     );
    // }
    
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

    // postMessageAllTranslators$(qtRequest: string, gtRequest: string, etRequest: string, threadIdQt: string, threadIdGt: string, threadIdEt: string): Observable<AllTranslatorsResponse> {
    //     console.log(qtRequest, gtRequest, etRequest);
    //     return this.http.post<IHTTPData<AllTranslatorsResponse>>(this.BASE_URL + 'translate-all', { qtRequest, gtRequest, etRequest, threadIdQt, threadIdGt, threadIdEt }).pipe(
    //         map(({ data }) => data),
    //         tap(console.log)
    //     );
    // }
    // pass IterationStepId as argument
    postMessageQTthenGT$(qtRequest: string, gtRequest: string, threadIdQt: string, threadIdGt: string): Observable<Question> {
        console.log(qtRequest, gtRequest);
        return this.http.post<IHTTPData<QTthenGTResponse>>(this.BASE_URL + 'qt-then-gt', { qtRequest, gtRequest, threadIdQt, threadIdGt }).pipe(
            // First identify if the goal already exists then builds the correct plan property the save if then return it 
            map(({ data }) => ({iterationStepId: "TODO", questionType: data.questionType, propertyId: data.goal})), // TODO :  goal is not the proper output
            tap(console.log)
        );
    }

    // postMessageAllTranslators$(qtRequest: string, gtRequest: string, etRequest: string, threadIdQt: string, threadIdGt: string, threadIdEt: string): Observable<AllTranslatorsResponse> {
    //     console.log(qtRequest, gtRequest, etRequest);
    //     return this.postMessageQT$(qtRequest, threadIdQt).pipe(
    //         catchError(error => {
    //             console.error('QT Request failed', error);
    //             return of(null);
    //         }),
    //         concatMap(qtResponse => {
    //             // Modify gtRequest with qtResponse if available
    //             const modifiedGtRequest = 
                
    //             return this.postMessageGT$(modifiedGtRequest, threadIdGt).pipe(
    //                 catchError(error => {
    //                     console.error('GT Request failed', error);
    //                     return of(null);
    //                 }),
    //                 concatMap(gtResponse =>


    //                     this.postMessageET$(etRequest, threadIdEt).pipe(
    //                         catchError(error => {
    //                             console.error('ET Request failed', error);
    //                             return of(null);
    //                         }),
    //                         map(etResponse => ({
    //                             qtResponse,
    //                             gtResponse,
    //                             etResponse
    //                         }))
    //                     )
    //                 )
    //             );
    //         }),
    //         tap(console.log)
    //     );
    // }
}
