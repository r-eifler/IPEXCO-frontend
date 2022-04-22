import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ADD, CLEAR, EDIT, ListStore, LOAD, REMOVE} from '../../store/generic-list.store';
import {IHTTPData} from '../../interface/http-data.interface';
import {environment} from '../../../environments/environment';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';


type Id = string | number;

export interface Identifiable {
  _id?: Id;
}

@Injectable({
  providedIn: 'root'
})
export class LocalObjectCollectionService<T extends Identifiable> {

  protected readonly collection$: BehaviorSubject<T[]>;

  http: HttpClient;
  listStore: ListStore<T>;

  constructor(listStore: ListStore<T>) {
    this.listStore = listStore;
    this.collection$ = listStore.items$;
  }

  getList(): BehaviorSubject<T[]> {
    return this.collection$;
  }

  getObject(id: number | string): Observable<T> {
    if (! id ) {
      throw  new Error('Undefined ID');
    }
    const o = this.existsObjectInStore(id);
    if (o) {
      const obs$ = new Observable();
      return of(o);
    }
    return null;
  }

  existsObjectInStore(id: number | string): T {
    for (const o of this.collection$.value) {
      if (o._id === id) {
        return o;
      }
    }
  }

  saveObject(object: T) {

    if (this.collection$.value.find(e => e._id == object._id)) {
      const action = {type: EDIT, data: object};
      this.listStore.dispatch(action);
      return;
    }

    const action = {type: ADD, data: object};
    this.listStore.dispatch(action);
  }

  deleteObject(object: T) {
    this.listStore.dispatch({type: REMOVE, data: object});
  }

  clear() {
    this.listStore.dispatch({type: CLEAR, data: null});
  }
}
