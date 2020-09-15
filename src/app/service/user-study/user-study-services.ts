import {Injectable} from '@angular/core';
import {ObjectCollectionService} from '../base/object-collection.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {RunningUserStudyStore, UserStudiesStore} from '../../store/stores.store';
import {environment} from '../../../environments/environment';
import {SelectedObjectService} from '../base/selected-object.service';
import {UserStudy, UserStudyData} from '../../interface/user-study/user-study';
import {IHTTPData} from '../../interface/http-data.interface';
import {LOAD} from '../../store/generic-list.store';

@Injectable({
  providedIn: 'root'
})
export class UserStudiesService extends ObjectCollectionService<UserStudy> {
  constructor(http: HttpClient, store: UserStudiesStore) {
    super(http, store);
    this.BASE_URL = environment.apiURL + 'user-study/';
  }

  loadData(id: string): Promise<UserStudyData[]> {
    return new Promise(((resolve, reject) => {
      this.http.get<IHTTPData<UserStudyData[]>>(this.BASE_URL + id + '/data', )
        .subscribe((res) => {
          resolve(res.data);
        });
    }));
  }

}

@Injectable({
  providedIn: 'root'
})
export class RunningUserStudyService extends SelectedObjectService<UserStudy> {
  constructor(
    store: RunningUserStudyStore) {
    super(store);
  }
}
