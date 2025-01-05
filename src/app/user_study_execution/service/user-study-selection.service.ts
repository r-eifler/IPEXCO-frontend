import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import {IHTTPData} from '../../shared/domain/http-data.interface';
import {map } from 'rxjs/operators';


@Injectable()
export class NextUserStudyService{

  private http = inject(HttpClient);
  private BASE_URL = environment.apiURL + 'user-study-participant-distribution/';

  getNextStudy$(id: string): Observable<string> {
    return this.http.get<IHTTPData<string>>(this.BASE_URL + id + '/next').pipe(
      map(({data}) => data)
    )
  }

}
