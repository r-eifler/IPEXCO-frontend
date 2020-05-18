import { Plan } from './../interface/plan';
import { EDIT, LOAD } from '../store/generic-list.store';
import {SelectedObjectService} from './selected-object.service';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {RunsStore, CurrentRunStore, CurrentQuestionStore} from '../store/stores.store';
import {ObjectCollectionService} from './object-collection.service';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {IHTTPData} from '../interface/http-data.interface';
import {PlanRun, ExplanationRun} from '../interface/run';
import { PddlFileUtilsService } from './pddl-file-utils.service';


interface QueryParam {
  param: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class RunService extends ObjectCollectionService<PlanRun> {

  constructor(http: HttpClient, store: RunsStore) {
    super(http, store);
    this.BASE_URL = environment.apiURL + 'run/plan-run/';
    this.pipeFind = map(sortRuns);

    }

  deleteExpRun(expRun: ExplanationRun) {
    return this.http.delete<IHTTPData<PlanRun>>( environment.apiURL + 'run/explanation/' + expRun._id)
      .subscribe(response => {
        this.listStore.dispatch({type: EDIT, data: response.data});
      });
  }

  getLastRun(): PlanRun {
    const lastValues: PlanRun[] = this.collection$.value;
    if (lastValues.length > 0) {
      return lastValues[lastValues.length - 1 ];
    } else {
      return null;
    }
  }

}

function sortRuns(runs: PlanRun[]): PlanRun[] {
  if (runs.length <= 1) {
    return runs;
  }
  console.log('RUNS: ');
  console.log(runs);
  let currentLast: PlanRun = findStart(runs);
  runs.splice(runs.indexOf(currentLast), 1);
  const sorted: PlanRun[] = [currentLast];

  while (runs.length > 0){
    for (const run of runs) {
      if (run.previousRun === currentLast._id) {
        currentLast = run;
        break;
      }
    }
    runs.splice(runs.indexOf(currentLast), 1);
    sorted.push(currentLast);
  }
  console.log('SORTED: ');
  console.log(sorted);
  return sorted;
}

function findStart(runs: PlanRun[]): PlanRun {
  for (const run of runs) {
    if (run.previousRun == null) {
      return run;
    }
  }
}


@Injectable({
  providedIn: 'root'
})
export class CurrentRunService extends SelectedObjectService<PlanRun> {

  constructor(store: CurrentRunStore, private fileUtilsService: PddlFileUtilsService) {
    super(store);
  }

  saveObject(planRun: PlanRun) {
    if (! planRun.plan) {
      const planContent$ = this.fileUtilsService.getFileContent(planRun.planPath);
      // console.log('Loade Plan');
      planContent$.subscribe((content) => {
        // console.log(content);
        if (content) {

          const lines = content.split('\n');
          lines.splice(-1, 1); // remove empty line at the end
          const costString = lines.splice(-1, 1)[0];
          const plan = parsePlan(lines);
          plan.cost = Number(costString.split(' ')[3]);
          planRun.plan = plan;
          this.selectedObjectStore.dispatch({type: LOAD, data: planRun});
        }
      });
    } else {
      this.selectedObjectStore.dispatch({type: LOAD, data: planRun});
    }
  }
}

function parsePlan(actionStrings: string[]): Plan {
  const res: Plan = {actions: [], cost: null};
  for (const a of actionStrings) {
    const action = a.replace('(', '').replace(')', '');
    const [name, ...args] = action.split(' ');
    res.actions.push({name, args});
  }

  return res;
}

@Injectable({
  providedIn: 'root'
})
export class CurrentQuestionService extends SelectedObjectService<ExplanationRun> {

  constructor(store: CurrentQuestionStore) {
    super(store);
  }
}

