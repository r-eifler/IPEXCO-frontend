import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {UserStudy} from '../domain/user-study';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import {IHTTPData} from '../../shared/domain/http-data.interface';
import {map} from 'rxjs/operators';



@Injectable()
export class UserStudyService{

  private http = inject(HttpClient);
  private BASE_URL = environment.apiURL + 'user-study';

  postUserStudies$(userStudy: UserStudy): Observable<UserStudy> {
    return this.http.post<IHTTPData<UserStudy>>(this.BASE_URL, {data: userStudy}).pipe(
      map(({data}) => data),
    )
  }

  getUserStudies$(): Observable<UserStudy[]> {
    return this.http.get<IHTTPData<UserStudy[]>>(this.BASE_URL).pipe(
      map(({data}) => data),
    )
  }

  deleteUserStudy$(id: string): Observable<boolean> {

    return this.http.delete<IHTTPData<boolean>>(this.BASE_URL + '/' + id).pipe(
      map(({data}) => data),
    )

  }
}
