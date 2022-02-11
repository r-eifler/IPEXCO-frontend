import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ADD, EDIT, ListStore, LOAD, REMOVE} from '../../store/generic-list.store';
import {IHTTPData} from '../../interface/http-data.interface';
import {environment} from '../../../environments/environment';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';


type Id = string | number;
interface Identifiable {
  _id?: Id;
}
export interface QueryParam {
  param: string;
  value: string;
}



@Injectable({
  providedIn: 'root'
})
export class ObjectCollectionService<T extends Identifiable> {

  BASE_URL = environment.apiURL;
  protected readonly collection$: BehaviorSubject<T[]>;

  http: HttpClient;
  listStore: ListStore<T>;

  constructor(http: HttpClient, listStore: ListStore<T>) {
    this.http = http;
    this.listStore = listStore;
    this.collection$ = listStore.items$;
  }


  pipeFindData = map((value: IHTTPData<T[]>): T[] =>  value.data);
  pipeGetData = map((value: IHTTPData<T>): T => value.data);

  pipeFind = map((value: T[]): T[] =>  value);
  pipeGet = map((value: T): T => value);

  findCollection(queryParams: QueryParam[] = []) {
    // console.log('find: ' + this.BASE_URL);
    let httpParams = new HttpParams();
    for ( const  qp of queryParams) {
      httpParams = httpParams.set(qp.param, qp.value);
    }

    this.http.get<IHTTPData<T[]>>(this.BASE_URL, {params: httpParams})
      .pipe(this.pipeFindData, this.pipeFind)
      .subscribe((res) => {
        // console.log('find: ' + this.BASE_URL);
        // console.log(res);
        this.listStore.dispatch({type: LOAD, data: res});
      });

    return this.collection$;
  }

  getList(): BehaviorSubject<T[]> {
    return this.collection$;
  }

  getObject(id: number | string): Observable<T> {
    // console.log(this.BASE_URL);
    if (! id ) {
      throw  new Error('Undefined ID');
    }
    const o = this.existsObjectInStore(id);
    if (o) {
      const obs$ = new Observable();
      return of(o);
    }
    return this.http.get<IHTTPData<T>>(this.BASE_URL + id).pipe(this.pipeGetData, this.pipeGet);
  }

  existsObjectInStore(id: number | string): T {
    for (const o of this.collection$.value) {
      if (o._id === id) {
        return o;
      }
    }
  }

  copyObject(object: T) {
    return this.http.post<IHTTPData<T>>(this.BASE_URL + object._id, object)
      .subscribe(httpData => {
        // console.log('Result Post:');
        // console.log(httpData.data);
        const action = {type: ADD, data: httpData.data};
        this.listStore.dispatch(action);
      });
  }

  saveObject(object: T) {

    // console.log(object);
    // console.log('Service save object:');

    if (object._id) {
      // console.log('edit');
      return this.http.put<IHTTPData<T>>(this.BASE_URL + object._id, object)
        .subscribe(httpData => {
          const action = {type: EDIT, data: httpData.data};
          this.listStore.dispatch(action);
        });
    }

    // console.log('add');
    return this.http.post<IHTTPData<T>>(this.BASE_URL, object)
      .subscribe(httpData => {
        // console.log('Result Post:');
        // console.log(httpData);
        const action = {type: ADD, data: httpData.data};
        this.listStore.dispatch(action);
      });
  }

  saveAndUpdateObject(object: T) {

    const action1 = {type: ADD, data: object};
    this.listStore.dispatch(action1);
    return this.http.post<IHTTPData<T>>(this.BASE_URL, object)
      .subscribe(httpData => {
        // console.log('Result Post:');
        // console.log(httpData.data);
        const action2 = {type: EDIT, data: httpData.data};
        this.listStore.dispatch(action2);
      });
  }

  deleteObject(object: T) {
    // console.log('Delete : ' + object._id);
    return this.http.delete(this.BASE_URL + object._id)
      .subscribe(response => {
        // console.log('Delete File response');
        this.listStore.dispatch({type: REMOVE, data: object});
      });
  }
}
