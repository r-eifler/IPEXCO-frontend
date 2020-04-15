import { Injectable } from '@angular/core';
import {ObjectCollectionService} from './object-collection.service';
import {PlanRun} from '../_interface/run';
import {HttpClient} from '@angular/common/http';
import {RunsStore} from '../store/stores.store';
import {environment} from '../../environments/environment';

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
    this.BASE_URL = this.myBaseURL + 'run';
    this.saveObject(run);
    this.BASE_URL = this.myBaseURL;
  }

}
