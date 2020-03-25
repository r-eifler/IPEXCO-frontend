import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {environment} from '../../environments/environment';
import {IPDDLFileHttp} from '../_interface/http-models/pddlfile-http.interface';

@Injectable()
export class DomainFileService {

  domainUrl = `${environment.apiURL}pddl-file`;

  constructor(private http: HttpClient) { }

  getDomainFiles(): Observable<IPDDLFileHttp> {
    console.log('URL: ' + this.domainUrl);
    const res = this.http.get<IPDDLFileHttp>(this.domainUrl);
    console.log(res);
    return res;
  }
}
