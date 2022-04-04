import { PlanProperty } from './../../interface/plan-property/plan-property';

import { SelectedIterationStepService } from './selected-iteration-step.service';
import { IterationStep, RunStatus } from 'src/app/interface/run';
import { EDIT} from '../../store/generic-list.store';
import { Injectable} from '@angular/core';
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
      protected iterationStepsStore: IterationStepsStore
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

    const planRun: PlanRun = new PlanRun('Plan ', RunStatus.pending);
    step.plan = planRun;
    this.selectedStepService.saveObject(step);

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

  computeMUGS(step: IterationStep, question: string[], planProperties: PlanProperty[]): DepExplanationRun {

    const url = this.myBaseURL + 'mugs/' + step._id;

    let softGoals : string[] = step.hardGoals.filter(pp => ! question.some(h => h == pp));

    let expRun = new DepExplanationRun("DExp", RunStatus.pending, question, softGoals);

    console.log(expRun);

    this.http.post<IHTTPData<IterationStep>>(url, expRun)
      .subscribe(httpData => {
        let step = IterationStep.fromObject(httpData.data)
        const action = {type: EDIT, data: step};
        this.iterationStepsStore.dispatch(action);
        this.selectedStepService.updateIfSame(step);
      });

    return expRun;
  }

  computeRelaxExplanations(step: IterationStep) {

    const url = this.myBaseURL + 'relax_exp/' + step._id;

    this.http.post<IHTTPData<IterationStep>>(url, {})
      .subscribe(httpData => {
        let step = IterationStep.fromObject(httpData.data)
        const action = {type: EDIT, data: step};
        this.iterationStepsStore.dispatch(action);
        this.selectedStepService.updateIfSame(step);
      });

  }

}

