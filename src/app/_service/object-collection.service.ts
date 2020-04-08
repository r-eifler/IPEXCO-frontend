import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ADD, EDIT, ListStore, LOAD, REMOVE} from '../store/generic-list.store';
import {IHTTPData} from '../_interface/http-data.interface';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';



type Id = string | number;
interface Identifiable {
  _id?: Id;
}



@Injectable({
  providedIn: 'root'
})
export class ObjectCollectionService<T extends Identifiable> {

  BASE_URL = environment.apiURL;
  readonly collection$: BehaviorSubject<T[]>;

  http: HttpClient;
  listStore: ListStore<T>;

  constructor(http: HttpClient, listStore: ListStore<T>) {
    this.http = http;
    this.listStore = listStore;
    this.collection$ = listStore.items$;
  }

  findCollection() {
    const httpParams = new HttpParams();

    this.http.get<IHTTPData<T>>(this.BASE_URL)
      .subscribe((res) => {
        this.listStore.dispatch({type: LOAD, data: res.data});
      });

    return this.collection$;
  }

  getObject(id: number | string): Observable<IHTTPData<T>> {
    return this.http.get<IHTTPData<T>>(this.BASE_URL + id);
  }

  saveObject(object: T) {

    console.log('Service save object:');
    console.log(object);

    if (object._id) {
      return this.http.put<IHTTPData<T>>(this.BASE_URL + object._id, object)
        .subscribe(httpData => {
          const action = {type: EDIT, data: httpData.data};
          this.listStore.dispatch(action);
        });
    }

    return this.http.post<IHTTPData<T>>(this.BASE_URL, object)
      .subscribe(httpData => {
        console.log('Result Post:');
        console.log(httpData.data);
        const action = {type: ADD, data: httpData.data};
        this.listStore.dispatch(action);
      });
  }

  deleteObject(object: T) {
    console.log('Delete : ' + object._id);
    return this.http.delete(this.BASE_URL + object._id)
      .subscribe(response => {
        console.log('Delete File response');
        this.listStore.dispatch({type: REMOVE, data: object});
      });
  }
}
