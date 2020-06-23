import { Plan } from './../interface/plan';
import { EDIT, LOAD, REMOVE } from '../store/generic-list.store';
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
import { PlanPropertyCollectionService } from './plan-property-services';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';


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
        this.listStore.dispatch({type: REMOVE, data: response.data});
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

  getNumRuns(): number {
    return this.collection$.value.length;
  }

  getNumQuestions(): number {
    let res = 0;
    for (const r of this.collection$.value) {
      res += r.explanationRuns.length;
    }
    return res;
  }

  reset() {
    this.listStore.reset();
  }

}

function sortRuns(runs: PlanRun[]): PlanRun[] {
  if (runs.length <= 1) {
    return runs;
  }
  // console.log('RUNS: ');
  // console.log(runs);
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
  // console.log('SORTED: ');
  // console.log(sorted);
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
export class DemoRunService extends RunService {

  constructor(http: HttpClient, store: RunsStore) {
    super(http, store);
    console.log('DemoRunService');
  }

  findCollection(queryParams: QueryParam[] = []) {
    return this.collection$;
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
    console.log('Current run stored');
    if (planRun.planString && ! planRun.plan) {
      handlePlanString(planRun.planString, planRun);
      this.selectedObjectStore.dispatch({type: LOAD, data: planRun});

    } else if (planRun.planPath && ! planRun.plan) {
      const planContent$ = this.fileUtilsService.getFileContent(planRun.planPath);
      // console.log('Loade Plan');
      planContent$.subscribe((content) => {
        // console.log(content);
        if (content) {
          handlePlanString(content, planRun);
          this.selectedObjectStore.dispatch({type: LOAD, data: planRun});
        }
      });
    } else {
      this.selectedObjectStore.dispatch({type: LOAD, data: planRun});
    }
  }
}

function handlePlanString(planString: string, planRun: PlanRun) {
  const lines = planString.split('\n');
  lines.splice(-1, 1); // remove empty line at the end
  const costString = lines.splice(-1, 1)[0];
  const plan = parsePlan(lines);
  plan.cost = Number(costString.split(' ')[3]);
  planRun.plan = plan;
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

  constructor(
    store: CurrentQuestionStore,
    protected fileUtilsService: PddlFileUtilsService,
    protected planPropertiesService: PlanPropertyCollectionService
  ) {
    super(store);
  }

  saveObject(questionRun: ExplanationRun) {
    if (! questionRun.mugs) {
      console.log('Question service get MUGS');
      questionRun.mugs = [];
      const answer = JSON.parse(questionRun.result);
      for (const mugs of answer.MUGS) {
        const list = [];
        for (const elem of mugs) {
            list.push(elem.replace('sat_', '').replace('soft_accepting(', '').replace(')', ''));
        }
        questionRun.mugs.push(list);
      }
      this.selectedObjectStore.dispatch({type: LOAD, data: questionRun});
      // combineLatest([this.fileUtilsService.getFileContent(questionRun.result), this.planPropertiesService.getList()]).subscribe(
      //   ([content, planProperties]) => {
      //   questionRun.mugs = [];
      //   const answer = JSON.parse(content);
      //   for (const mugs of answer.MUGS) {
      //     const list = [];
      //     for (const elem of mugs) {
      //         const pp = planProperties.find(p => p.name === elem.replace('sat_', ''));
      //         list.push(pp.naturalLanguageDescription);
      //     }
      //     questionRun.mugs.push(list);
      //   }
      //   this.selectedObjectStore.dispatch({type: LOAD, data: questionRun});
      // });
    } else {
      this.selectedObjectStore.dispatch({type: LOAD, data: questionRun});
    }
  }
}


