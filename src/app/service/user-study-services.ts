import {Injectable} from '@angular/core';
import {ObjectCollectionService} from './object-collection.service';
import {HttpClient} from '@angular/common/http';
import {RunningUserStudyStore, UserStudiesStore} from '../store/stores.store';
import {environment} from '../../environments/environment';
import {SelectedObjectService} from './selected-object.service';
import {UserStudy} from '../interface/user-study/user-study';

@Injectable({
  providedIn: 'root'
})
export class UserStudiesService extends ObjectCollectionService<UserStudy> {
  constructor(http: HttpClient, store: UserStudiesStore) {
    super(http, store);
    this.BASE_URL = environment.apiURL + 'user-study/';
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
