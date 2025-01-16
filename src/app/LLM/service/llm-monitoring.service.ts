import { inject, Injectable } from '@angular/core';
import { tap, map, filter, take, exhaustMap } from 'rxjs/operators';
import { interval, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IHTTPData } from 'src/app/shared/domain/http-data.interface';

export interface LLMResponse {
    status: 'queued' | 'in_progress' | 'requires_action' | 'cancelling' | 'cancelled' | 'failed' | 'completed' | 'incomplete' | 'expired';
    response?: any;
    threadId?: string;
}

@Injectable({
    providedIn: 'root'
})
export class LLMMonitoringService {
    private http = inject(HttpClient);
    private BASE_URL = environment.apiURL + "llm/";

    checkLLMResponse$(projectId: string, requestId: string): Observable<LLMResponse> {
        return interval(1000).pipe(
            exhaustMap(() => {
                let params = new HttpParams()
                    .set('projectId', projectId)
                    .set('requestId', requestId);
                    
                return this.http.get<IHTTPData<LLMResponse>>(this.BASE_URL + 'status', { params }).pipe(
                    map(({ data }) => data)
                );
            }),
            filter(response => response.status === 'completed' || response.status === 'failed'),
            take(1)
        );
    }
}
