import { MapStore } from "../../store/generic-map.store";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { BehaviorSubject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ADD, EDIT, LOAD, REMOVE } from "../../store/generic-list.store";
import { map } from "rxjs/operators";
import { IHTTPData } from "../../interface/http-data.interface";

type Id = string | number;
interface Identifiable {
  _id?: Id;
}
interface QueryParam {
  param: string;
  value: string;
}

@Injectable({
  providedIn: "root",
})
export abstract class ObjectMapService<K, T extends Identifiable> {
  BASE_URL = environment.apiURL;
  protected readonly map$: BehaviorSubject<Map<K, T>>;

  http: HttpClient;
  mapStore: MapStore<K, T>;

  pipeFindData = map((value: IHTTPData<T[]>): T[] => value.data);
  pipeGetData = map((value: IHTTPData<T>): T => value.data);

  pipeFind = map((value: T[]): T[] => value);
  pipeGet = map((value: T): T => value);

  constructor(http: HttpClient, mapStore: MapStore<K, T>) {
    this.http = http;
    this.mapStore = mapStore;
    this.map$ = mapStore.items$;
  }

  abstract getKey(t: T): K;

  findCollection(queryParams: QueryParam[] = []) {
    // console.log('find: ' + this.BASE_URL);
    let httpParams = new HttpParams();
    for (const qp of queryParams) {
      httpParams = httpParams.set(qp.param, qp.value);
    }

    this.http
      .get<IHTTPData<T[]>>(this.BASE_URL, { params: httpParams })
      .pipe(this.pipeFindData, this.pipeFind)
      .subscribe((res) => {
        const tuples = res.map((v) => {
          return [this.getKey(v), v];
        });
        // console.log(tuples);
        this.mapStore.dispatch({ type: LOAD, data: tuples });
      });

    return this.map$;
  }

  getMap(): BehaviorSubject<Map<K, T>> {
    return this.map$;
  }

  existsObjectInStore(key: K): T {
    return this.map$.value.get(key);
  }

  copyObject(object: T) {
    return this.http
      .post<IHTTPData<T>>(this.BASE_URL + object._id, { data: object })
      .subscribe((httpData) => {
        const action = {
          type: ADD,
          key: this.getKey(httpData.data),
          data: httpData.data,
        };
        this.mapStore.dispatch(action);
      });
  }

  saveObject(object: T) {
    if (object._id) {
      return this.http
        .put<IHTTPData<T>>(this.BASE_URL + object._id, { data: object })
        .subscribe((httpData) => {
          const action = {
            type: EDIT,
            key: this.getKey(httpData.data),
            data: httpData.data,
          };
          this.mapStore.dispatch(action);
        });
    }

    return this.http
      .post<IHTTPData<T>>(this.BASE_URL, { data: object })
      .subscribe((httpData) => {
        const action = {
          type: ADD,
          key: this.getKey(httpData.data),
          data: httpData.data,
        };
        this.mapStore.dispatch(action);
      });
  }

  saveAndUpdateObject(object: T) {
    const action1 = { type: ADD, key: this.getKey(object), data: object };
    this.mapStore.dispatch(action1);
    return this.http
      .post<IHTTPData<T>>(this.BASE_URL, { data: object })
      .subscribe((httpData) => {
        const action2 = {
          type: EDIT,
          key: this.getKey(httpData.data),
          data: httpData.data,
        };
        this.mapStore.dispatch(action2);
      });
  }

  deleteObject(object: T) {
    return this.http
      .delete(this.BASE_URL + object._id)
      .subscribe((response) => {
        this.mapStore.dispatch({ type: REMOVE, key: this.getKey(object) });
      });
  }
}
