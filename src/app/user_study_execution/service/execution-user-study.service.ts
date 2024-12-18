import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import {IHTTPData} from '../../shared/domain/http-data.interface';
import {map} from 'rxjs/operators';
import {UserStudy} from '../../user_study/domain/user-study';



@Injectable()
export class ExecutionUserStudyService {

  private http = inject(HttpClient);
  private BASE_URL = environment.apiURL + 'user-study/';

  getUserStudy$(id: string): Observable<UserStudy> {
    return this.http.get<IHTTPData<UserStudy>>(this.BASE_URL + id).pipe(
      map(({data}) => ({
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      })),
    )
  }
}
