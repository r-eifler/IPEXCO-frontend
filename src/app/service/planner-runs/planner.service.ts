import { SelectedIterationStepService } from './selected-iteration-step.service';
import { IterationStepsService } from 'src/app/service/planner-runs/iteration-steps.service';
import { IterationStep, RunStatus } from 'src/app/interface/run';
import {ADD, EDIT} from '../../store/generic-list.store';
import {EventEmitter, Injectable} from '@angular/core';
import {ObjectCollectionService} from '../base/object-collection.service';
import {DepExplanationRun, PlanRun} from '../../interface/run';
import {HttpClient, HttpParams} from '@angular/common/http';
import {IterationStepsStore} from '../../store/stores.store';
import {environment} from '../../../environments/environment';
import {IHTTPData} from '../../interface/http-data.interface';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlannerService{

  BASE_URL : string;
  myBaseURL = environment.apiURL + 'planner/';

  // Indicates if the Planner is currently busy and it is possible to request an other plan.
  plannerBusy = new BehaviorSubject(false);

  constructor(
      protected http: HttpClient,
      protected selectedStepService: SelectedIterationStepService,
      protected iterationStepsStore: IterationStepsStore,
  ) {
    this.BASE_URL = environment.apiURL + 'planner/';
  }

  isPlannerBusy(): BehaviorSubject<boolean> {
    return this.plannerBusy;
  }

  computePlan(step: IterationStep, save = true): void {
    console.log("compute plan");
    let httpParams = new HttpParams();
    httpParams = httpParams.set('save', String(save));

    // const planRun: PlanRun = new PlanRun('Plan ', RunStatus.pending);
    // step.plan = planRun;
    // this.iterationStepsService.saveObject(step);

    this.BASE_URL = this.myBaseURL + 'plan';
    this.http.post<IHTTPData<IterationStep>>(this.BASE_URL, {data: step}, {params: httpParams})
      .subscribe(httpData => {
        let step = IterationStep.fromObject(httpData.data)
        const action = {type: EDIT, data: step};
        this.iterationStepsStore.dispatch(action);
        this.selectedStepService.updateIfSame(step);
      });
  }

  execute_plan_run(run: PlanRun, save= true): void {
    // TODO
    console.log('not imlemented');
  }

  execute_mugs_run(planRun: PlanRun, expRun: DepExplanationRun): void {
    this.plannerBusy.next(true);

    const url = this.myBaseURL + 'mugs/' + planRun._id;

    this.http.post<IHTTPData<PlanRun>>(url, expRun)
      .subscribe(httpData => {
        // TODO
      });
  }

}

