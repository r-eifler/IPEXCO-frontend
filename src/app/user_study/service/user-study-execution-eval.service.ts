import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IHTTPData } from '../../shared/domain/http-data.interface';
import {HttpClient, HttpParams} from '@angular/common/http';
import { map, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {UserStudyExecution} from '../domain/user-study-execution';

@Injectable({
  providedIn: 'root',
})
export class UserStudyExecutionEvalService {

  private http = inject(HttpClient)
  private BASE_URL = environment.apiURL + 'user-study-execution/';

  accept(userId: string): Observable<boolean> {
    return this.http.put<boolean>(this.BASE_URL + 'accept/' + userId, {})
  }

  getParticipants(userStudyId: string): Observable<UserStudyExecution[]> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('userStudyId', userStudyId);

    return this.http.get<IHTTPData<UserStudyExecution[]>>(this.BASE_URL, { params: httpParams }).pipe(
      map(({data}) => data),
      map(execs => execs.map(exec => ({
          ...exec,
          createdAt: new Date(exec.createdAt),
          updatedAt: new Date(exec.updatedAt),
          finishedAt: new Date(exec.finishedAt),
          timeLog: exec.timeLog.map(a => JSON.parse(a as any as string))
        })
      ))
    )
  }

}
