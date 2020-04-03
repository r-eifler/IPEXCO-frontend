import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {IHTTPData} from '../_interface/http-data.interface';
import {HttpParams} from '@angular/common/http';

import {environment} from '../../environments/environment';
import {PDDLFile} from '../_interface/pddlfile';
import {LOAD, ADD, EDIT, REMOVE, ListStore} from '../store/generic-list.store';
import {DomainFilesStore} from '../store/stores.store';

import {Observable} from 'rxjs';

const BASE_URL = environment.apiURL + 'pddl-file/';

@Injectable()
export class PddlFilesService {

  type = '';
  private http: HttpClient;
  private filesStore: ListStore<PDDLFile>;

  constructor(http: HttpClient, filesStore: ListStore<PDDLFile>) {
    this.http = http;
    this.filesStore = filesStore;
    this.files$ = filesStore.items$;
  }

  files$: Observable<PDDLFile[]>;

  findFiles(query = '', sort = 'id', order = 'ASC') {
    const httpParams = new HttpParams();
    httpParams.append('q', query);
    httpParams.append('_sort', sort);
    httpParams.append('_order', order);

    this.http.get<IHTTPData<PDDLFile>>(BASE_URL + 'type/' + this.type + '/', {params: httpParams})
      .subscribe((res) => {
        this.filesStore.dispatch({type: LOAD, data: res.data});
      });

    return this.files$;
  }

  getDomainFile(id: number | string): Observable<IHTTPData<PDDLFile>> {
    return this.http.get<IHTTPData<PDDLFile>>(BASE_URL + id);
  }

  saveDomainFile(domainFile: PDDLFile) {

    const formData = new FormData();
    formData.append('pddlfile', domainFile.content);
    formData.append('name', domainFile.name);
    formData.append('domain', domainFile.domain);
    formData.append('type', domainFile.type);

    if (domainFile._id) {
      return this.http.put<IHTTPData<PDDLFile>>(BASE_URL + domainFile._id, formData)
        .subscribe(httpData => {
          const action = {type: EDIT, data: httpData.data};
          this.filesStore.dispatch(action);
        });
    }

    return this.http.post<IHTTPData<PDDLFile>>(BASE_URL, formData)
      .subscribe(httpData => {
        console.log(httpData.data);
        const action = {type: ADD, data: httpData.data};
        this.filesStore.dispatch(action);
      });
  }

  deleteDomainFile(domainFile: PDDLFile) {
    console.log('Delete File: ' + domainFile._id);
    return this.http.delete(BASE_URL + domainFile._id)
      .subscribe(response => {
        console.log('Delete File response');
        this.filesStore.dispatch({type: REMOVE, data: domainFile});
      });
  }
}
