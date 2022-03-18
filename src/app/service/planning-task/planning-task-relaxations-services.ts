import { ObjectCollectionService, QueryParam } from './../base/object-collection.service';
import {PlanningTaskRelaxationsStore, PlanPropertyMapStore} from '../../store/stores.store';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PlanProperty} from '../../interface/plan-property/plan-property';
import {environment} from '../../../environments/environment';
import {ObjectMapService} from '../base/object-map.service';
import { PlanningTaskRelaxationSpace } from 'src/app/interface/planning-task-relaxation';
import { IHTTPData } from 'src/app/interface/http-data.interface';
import { ADD, EDIT, LOAD } from 'src/app/store/generic-list.store';


@Injectable({
  providedIn: 'root'
})
export class PlanningTaskRelaxationService extends ObjectCollectionService<PlanningTaskRelaxationSpace> {

  constructor(http: HttpClient, store: PlanningTaskRelaxationsStore) {
    super(http, store);
    this.BASE_URL = environment.apiURL + 'planning-task-relaxation/';
  }

  findCollection(queryParams: QueryParam[] = []) {
    let httpParams = new HttpParams();
    for ( const  qp of queryParams) {
      httpParams = httpParams.set(qp.param, qp.value);
    }

    this.http.get<IHTTPData<PlanningTaskRelaxationSpace[]>>(this.BASE_URL, {params: httpParams})
      .pipe(this.pipeFindData, this.pipeFind)
      .subscribe((res) => {
        let spaces = res.map(e => PlanningTaskRelaxationSpace.fromObject(e))
        this.listStore.dispatch({type: LOAD, data: spaces});
      });

    return this.collection$;
  }

  saveObject(object: PlanningTaskRelaxationSpace) {

    if (object._id) {
      return this.http.put<IHTTPData<PlanningTaskRelaxationSpace>>(this.BASE_URL + object._id, {data: object})
        .subscribe(httpData => {
          const action = {type: EDIT, data: PlanningTaskRelaxationSpace.fromObject(httpData.data)};
          this.listStore.dispatch(action);
        });
    }

    return this.http.post<IHTTPData<PlanningTaskRelaxationSpace>>(this.BASE_URL, {data: object})
      .subscribe(httpData => {
        const action = {type: ADD, data: PlanningTaskRelaxationSpace.fromObject(httpData.data)};
        this.listStore.dispatch(action);
      });
  }
}
