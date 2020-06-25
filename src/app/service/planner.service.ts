import { PlanProperty } from './../interface/plan-property';
import { RunningDemoService } from './demo-services';
import { EDIT } from '../store/generic-list.store';
import { Injectable } from '@angular/core';
import {ObjectCollectionService} from './object-collection.service';
import {ExplanationRun, PlanRun, RunStatus} from '../interface/run';
import {HttpClient, HttpParams} from '@angular/common/http';
import {RunsStore} from '../store/stores.store';
import {environment} from '../../environments/environment';
import {IHTTPData} from '../interface/http-data.interface';
import {ADD} from '../store/generic-list.store';
import { Demo } from '../interface/demo';
import { PlanPropertyMapService } from './plan-property-services';

@Injectable({
  providedIn: 'root'
})
export class PlannerService extends ObjectCollectionService<PlanRun> {

  myBaseURL = environment.apiURL + 'planner/';

  constructor(http: HttpClient, store: RunsStore) {
    super(http, store);
    this.BASE_URL = environment.apiURL + 'planner/';
  }

  execute_plan_run(run: PlanRun, save= true): void {
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

@Injectable({
  providedIn: 'root'
})
export class DemoPlannerService extends PlannerService {

  myBaseURL = environment.apiURL + 'planner/';

  constructor(
    http: HttpClient,
    store: RunsStore,
    private runningDemoService: RunningDemoService,
    private planPropertiesService: PlanPropertyMapService) {
    super(http, store);
    this.BASE_URL = environment.apiURL + 'planner/';
  }

  execute_plan_run(run: PlanRun): void {
    const demo: Demo = this.runningDemoService.getSelectedObject().getValue();

    const planPropertiesGoalFacts = run.hardGoals;

    let foundPlanObj = null;
    for (const planObj of demo.data.plans) {
      if (planObj.planProperties.length === planPropertiesGoalFacts.length) {
        for (const goalFact of planPropertiesGoalFacts) {
          if (planObj.planProperties.indexOf(goalFact) === -1) {
            break;
          }
          foundPlanObj = planObj;
        }
      }
      if (foundPlanObj) {
        break;
      }
    }
    if (! foundPlanObj) {
      // run.status = RunStatus.failed;
      // this.listStore.dispatch({type: ADD, data: run});
      console.log('Compute plan on server demo');
      super.execute_plan_run(run, false);
      return;
    }

    run.planPath = demo.definition + '/' + foundPlanObj.plan;

    // get all properties which are satisfied by this plan
    run.satPlanProperties = demo.data.satPropertiesPerPlan.filter(p => p.plan === foundPlanObj.plan)[0].planProperties;
    this.listStore.dispatch({type: ADD, data: run});
  }


  execute_mugs_run(planRun: PlanRun, expRun: ExplanationRun): void {

    const demo: Demo = this.runningDemoService.getSelectedObject().getValue();

    if (! demo.data.MUGS || demo.data.MUGS.length === 0) {
      super.execute_mugs_run(planRun, expRun);
    }

    // plan property hard goals which were no hard goals in the plan run
    const questionPlanProperties = expRun.hardGoals.filter(hg => ! planRun.hardGoals.some(c => hg === c));

    expRun.mugs = [];
    console.log('compute mugs demo');
    console.log(demo.data.MUGS);
    for (const mugs of demo.data.MUGS) {
      for (const propertyGoalFact of questionPlanProperties) {
        if (mugs.indexOf(propertyGoalFact) > -1) {
          const mugsRest = [];
          for (const fact of mugs) {
            if (fact !== propertyGoalFact) {
              mugsRest.push(fact.replace('Atom ', ''));
            }
          }
          if (mugsRest.length !== 0) {
            expRun.mugs.push(mugsRest);
          }

          break;
        }
      }
    }

    // console.log('MUGS:');
    // console.log(expRun.mugs);
    planRun.explanationRuns.push(expRun);
    this.listStore.dispatch({type: EDIT, data: planRun});
  }

}
