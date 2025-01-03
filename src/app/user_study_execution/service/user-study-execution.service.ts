import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IHTTPData } from '../../shared/domain/http-data.interface';
import { HttpClient } from '@angular/common/http';
import { map, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import { UserAction } from '../domain/user-action';

@Injectable({
  providedIn: 'root',
})
export class UserStudyExecutionService {

  private http = inject(HttpClient)
  private BASE_URL = environment.apiURL + 'user-study-execution/';

  finish(): Observable<boolean> {
    return this.http.put<boolean>(this.BASE_URL + 'finish', {}).pipe(tap(console.log))
  }

  cancel(): Observable<boolean> {
    return this.http.put<boolean>(this.BASE_URL + 'cancel', {})
  }

  log$(action: UserAction): Observable<boolean> {
  
    const sendAction = {
      ...action,
      timeStamp: new Date(),
    }

    console.log("Execution Service log action: ");
    const JSONAction = JSON.stringify(sendAction);
    console.log(JSONAction);

    return this.http.put<IHTTPData<boolean>>(this.BASE_URL + 'action', {action: JSONAction}).pipe(
      map(({data}) => data)
    )
  }

  logLLMContext$(): Observable<boolean> {
    return this.http.put<IHTTPData<boolean>>(this.BASE_URL + 'save-llm-context', {}).pipe(
      map(({data}) => data)
    )
  }

}
