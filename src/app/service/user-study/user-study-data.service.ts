import { ObjectCollectionService } from './../base/object-collection.service';
import { UserStudyCurrentDataStore, UserStudyDataStore } from './../../store/stores.store';
import { SelectedObjectService } from './../base/selected-object.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LOAD } from 'src/app/store/generic-item.store';
import { environment } from 'src/environments/environment';
import { IHTTPData } from 'src/app/interface/http-data.interface';
import { UserStudyData } from 'src/app/interface/user-study/user-study-store';

@Injectable({
  providedIn: 'root'
})
export class UserStudyCurrentDataService extends SelectedObjectService<UserStudyData> {

  BASE_URL = environment.apiURL + "user-study-data/";

constructor(private http: HttpClient, store: UserStudyCurrentDataStore) {
  super(store);
}


updateObject(data: UserStudyData) {

  //check if it's the same datapoint as in the store

  this.http
    .put<IHTTPData<UserStudyData>>(this.BASE_URL, {data: data})
    .subscribe((httpData) => {
      this.selectedObjectStore.dispatch({ type: LOAD, data: httpData.data });
    });
}

}


@Injectable({
  providedIn: 'root'
})
export class UserStudyDataService extends ObjectCollectionService<UserStudyData> {

  BASE_URL = environment.apiURL + "user-study-data/";

constructor(http: HttpClient, store: UserStudyDataStore) {
  super(http, store);
}

}
