import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IHTTPData } from '../../shared/domain/http-data.interface';
import {HttpClient, HttpParams} from '@angular/common/http';
import { map, Observable} from 'rxjs';
import {User} from '../../user/domain/user';
import {tap} from 'rxjs/operators';
import {Demo} from '../../demo/domain/demo';
import {UserStudyExecution} from '../domain/user-study-execution';

@Injectable({
  providedIn: 'root',
})
export class UserStudyExecutionEvalService {

  private http = inject(HttpClient)
  private BASE_URL = environment.apiURL + 'user-study-execution/';

  getParticipants(userStudyId: string) {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('userStudyId', userStudyId);

    return this.http.get<IHTTPData<UserStudyExecution[]>>(this.BASE_URL, { params: httpParams }).pipe(
      map(({data}) => data),
      map(execs => execs.map(exec => ({
        ...exec,
        createdAt: new Date(exec.createdAt),
        updatedAt: new Date(exec.updatedAt),
      })))
    )
  }

}
