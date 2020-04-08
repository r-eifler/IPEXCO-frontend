import { Injectable } from '@angular/core';
import {ObjectCollectionService} from './object-collection.service';
import {Run} from '../_interface/run';
import {HttpClient} from '@angular/common/http';
import {RunsStore} from '../store/stores.store';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlannerService extends ObjectCollectionService<Run> {

  myBaseURL = environment.apiURL + 'planner/';

  constructor(http: HttpClient, store: RunsStore) {
    super(http, store);
    this.BASE_URL = environment.apiURL + 'planner/';
  }

  compute_mugs(run: Run): void {
    this.BASE_URL = this.myBaseURL + 'mugs';
    this.saveObject(run);
    this.BASE_URL = this.myBaseURL;
  }

  compute_plan(run: Run): void {
    this.BASE_URL = this.myBaseURL + 'plan';
    this.saveObject(run);
    this.BASE_URL = this.myBaseURL;
  }
}
