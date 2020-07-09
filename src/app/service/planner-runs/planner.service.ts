import {ADD, EDIT} from '../../store/generic-list.store';
import {Injectable} from '@angular/core';
import {ObjectCollectionService} from '../base/object-collection.service';
import {ExplanationRun, PlanRun} from '../../interface/run';
import {HttpClient, HttpParams} from '@angular/common/http';
import {RunsStore} from '../../store/stores.store';
import {environment} from '../../../environments/environment';
import {IHTTPData} from '../../interface/http-data.interface';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlannerService extends ObjectCollectionService<PlanRun> {

  myBaseURL = environment.apiURL + 'planner/';

  // Indicates if the Planner is currently busy and it is possible to request an other plan.
  private plannerBusy = new BehaviorSubject(false);

  constructor(http: HttpClient, store: RunsStore) {
    super(http, store);
    this.BASE_URL = environment.apiURL + 'planner/';
  }

  isPlannerBusy(): BehaviorSubject<boolean> {
    return this.plannerBusy;
  }

  execute_plan_run(run: PlanRun, save= true): void {
    this.plannerBusy.next(true);

    let httpParams = new HttpParams();
    httpParams = httpParams.set('save', String(save));

    this.BASE_URL = this.myBaseURL + 'plan';
    this.http.post<IHTTPData<PlanRun>>(this.BASE_URL, run, {params: httpParams})
      .subscribe(httpData => {
        const runLoaded = this.existsObjectInStore(httpData.data._id);
        let action = null;
        if (runLoaded) {
          action = {type: EDIT, data: httpData.data};
        } else {
          action = {type: ADD, data: httpData.data};
        }
        this.listStore.dispatch(action);
        this.plannerBusy.next(false);
      });
  }

  execute_mugs_run(planRun: PlanRun, expRun: ExplanationRun): void {
    this.plannerBusy.next(true);

    const url = this.myBaseURL + 'mugs/' + planRun._id;

    this.http.post<IHTTPData<PlanRun>>(url, expRun)
      .subscribe(httpData => {
        const action = {type: EDIT, data: httpData.data};
        this.listStore.dispatch(action);
        this.plannerBusy.next(false);
      });
  }

}

