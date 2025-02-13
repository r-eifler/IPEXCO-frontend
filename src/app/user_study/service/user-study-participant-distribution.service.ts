import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import {IHTTPData} from '../../shared/domain/http-data.interface';
import {map} from 'rxjs/operators';
import { ParticipantDistribution, ParticipantDistributionBase } from '../domain/participant-distribution';



@Injectable()
export class UserStudyParticipantDistributionService{

  private http = inject(HttpClient);
  private BASE_URL = environment.apiURL + 'user-study-participant-distribution/';

  postParticipantDistribution$(distribution: ParticipantDistributionBase): Observable<ParticipantDistribution> {
    return this.http.post<IHTTPData<ParticipantDistribution>>(this.BASE_URL, {data: distribution}).pipe(
      map(({data}) => (data)),
    )
  }

  putParticipantDistribution$(distribution: ParticipantDistribution): Observable<ParticipantDistribution> {
    return this.http.put<IHTTPData<ParticipantDistribution>>(this.BASE_URL + distribution._id, {data: distribution}).pipe(
      map(({data}) => (data)),
    )
  }

  getParticipantDistributions$(): Observable<ParticipantDistribution[]> {
    return this.http.get<IHTTPData<ParticipantDistribution[]>>(this.BASE_URL).pipe(
      map(({data}) => data),
    )
  }

  getParticipantDistribution$(id: string): Observable<ParticipantDistribution> {
    return this.http.get<IHTTPData<ParticipantDistribution>>(this.BASE_URL + id).pipe(
      map(({data}) => (data)),
    )
  }

  deleteParticipantDistribution$(id: string): Observable<boolean> {

    return this.http.delete<IHTTPData<boolean>>(this.BASE_URL + id).pipe(
      map(({data}) => data),
    )

  }
}
