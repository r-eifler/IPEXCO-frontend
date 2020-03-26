import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {IHTTPData} from '../_interface/http-data.interface';
import {HttpParams} from '@angular/common/http';

import {environment} from '../../environments/environment';
import {PDDLFile} from '../_interface/pddlfile';
import {LOAD, ADD, EDIT, REMOVE} from '../store/generic-list.store';
import {DomainFilesStore} from '../store/stores.store';

import {URLSearchParams} from 'url';
import {BehaviorSubject, Observable} from 'rxjs';

const BASE_URL = `${environment.apiURL}pddl-file/`;

@Injectable()
export class DomainFilesService {

  constructor(private http: HttpClient, private domainFilesStore: DomainFilesStore) {
    this.domainFiles$ = domainFilesStore.items$;
  }

  domainFiles$: Observable<PDDLFile[]>;

  getDomainFiles(): Observable<IHTTPData<PDDLFile>> {
    const res = this.http.get<IHTTPData<PDDLFile>>(BASE_URL);
    console.log(res);
    return res;
  }

  findDomainFiles(query = '', sort = 'id', order = 'ASC') {
    const httpParams = new HttpParams();
    httpParams.append('q', query);
    httpParams.append('_sort', sort);
    httpParams.append('_order', order);

    this.http.get<PDDLFile>(BASE_URL, {params: httpParams})
      .subscribe((files) => {
        this.domainFilesStore.dispatch({type: LOAD, data: files.data});
      });

    return this.domainFiles$;
  }

  getDomainFile(id: number | string): Observable<PDDLFile> {
    return this.http.get<PDDLFile>(BASE_URL + id);
  }

  saveDomainFile(domainFile: PDDLFile) {

    const formData = new FormData();
    formData.append('pddlfile', domainFile.data);
    formData.append('name', domainFile.name);
    formData.append('domain', domainFile.domain);
    formData.append('type', 'domain');

    if (domainFile._id) {
      return this.http.put<IHTTPData<PDDLFile>>(BASE_URL + domainFile._id, formData)
        .subscribe(httpData => {
          const action = {type: EDIT, data: httpData.data};
          this.domainFilesStore.dispatch(action);
        });
    }

    return this.http.post<IHTTPData<PDDLFile>>(BASE_URL, formData)
      .subscribe(httpData => {
        console.log(httpData.data);
        const action = {type: ADD, data: httpData.data};
        this.domainFilesStore.dispatch(action);
      });
  }

  deleteDomainFile(domainFile: PDDLFile) {
    console.log('Delete File: ' + domainFile._id);
    return this.http.delete(BASE_URL + domainFile._id)
      .subscribe(response => {
        console.log('Delete File response');
        this.domainFilesStore.dispatch({type: REMOVE, data: domainFile});
      });
  }
}
