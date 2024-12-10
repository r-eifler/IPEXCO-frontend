import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IHTTPData } from '../../shared/domain/http-data.interface';
import { HttpClient } from '@angular/common/http';
import { map, Observable} from 'rxjs';
import {User} from '../../user/domain/user';
import {tap} from 'rxjs/operators';

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

}
