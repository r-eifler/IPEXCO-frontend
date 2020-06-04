import { rejects } from 'assert';
import { DemosStore } from './../store/stores.store';
import { Demo } from './../interface/demo';
import { Injectable } from '@angular/core';
import { ObjectCollectionService } from './object-collection.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IHTTPData } from '../interface/http-data.interface';
import { EDIT, ADD, REMOVE } from '../store/generic-list.store';

@Injectable({
  providedIn: 'root'
})
export class DemosService extends ObjectCollectionService<Demo> {

  constructor(http: HttpClient, store: DemosStore) {
    super(http, store);
    this.BASE_URL = environment.apiURL + 'demo/';
  }

  generateDemo(demo: Demo): void {
    this.http.post<IHTTPData<Demo>>(this.BASE_URL, demo)
      .subscribe(httpData => {
        const runLoaded = this.existsObjectInStore(httpData.data._id);
        let action = null;
        if (runLoaded) {
          action = {type: EDIT, data: httpData.data};
        } else {
          action = {type: ADD, data: httpData.data};
        }
        this.listStore.dispatch(action);
      });
  }

  cancelDemo(demo: Demo): Promise<boolean> {
    console.log('Cancel Demo!');
    const p = new Promise<boolean>((resolve, reject) => {
      this.http.post<{data: Demo, successful: boolean}>(`${this.BASE_URL}cancel/${demo._id}`, demo)
      .subscribe(httpData => {
        console.log('Cancel Demo: ');
        console.log(httpData);
        this.listStore.dispatch({type: REMOVE, data: demo});
        resolve(httpData.successful);
      });
    });
    return p;
  }


  getNum(): number {
    return this.collection$.value.length;
  }

}

