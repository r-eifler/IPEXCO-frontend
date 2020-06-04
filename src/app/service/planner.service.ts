import { EDIT } from '../store/generic-list.store';
import { Injectable } from '@angular/core';
import {ObjectCollectionService} from './object-collection.service';
import {ExplanationRun, PlanRun} from '../interface/run';
import {HttpClient} from '@angular/common/http';
import {RunsStore} from '../store/stores.store';
import {environment} from '../../environments/environment';
import {IHTTPData} from '../interface/http-data.interface';
import {ADD} from '../store/generic-list.store';

@Injectable({
  providedIn: 'root'
})
export class PlannerService extends ObjectCollectionService<PlanRun> {

  myBaseURL = environment.apiURL + 'planner/';

  constructor(http: HttpClient, store: RunsStore) {
    super(http, store);
    this.BASE_URL = environment.apiURL + 'planner/';
  }

  execute_plan_run(run: PlanRun): void {
    this.BASE_URL = this.myBaseURL + 'plan';
    this.http.post<IHTTPData<PlanRun>>(this.BASE_URL, run)
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

  execute_mugs_run(planRun: PlanRun, expRun: ExplanationRun): void {
    const url = this.myBaseURL + 'mugs/' + planRun._id;
    this.http.post<IHTTPData<PlanRun>>(url, expRun)
      .subscribe(httpData => {
        // console.log('Result Post:');
        // console.log(httpData.data);
        const action = {type: EDIT, data: httpData.data};
        this.listStore.dispatch(action);
      });
  }

}
