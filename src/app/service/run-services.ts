import { TaskSchema } from 'src/app/interface/task-schema';
import { TaskSchemaService } from './schema.service';
import { Plan } from './../interface/plan';
import { LOAD, REMOVE } from '../store/generic-list.store';
import {SelectedObjectService} from './selected-object.service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RunsStore, CurrentRunStore, CurrentQuestionStore} from '../store/stores.store';
import {ObjectCollectionService} from './object-collection.service';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {IHTTPData} from '../interface/http-data.interface';
import {PlanRun, ExplanationRun} from '../interface/run';
import { PddlFileUtilsService } from './pddl-file-utils.service';
import { PlanPropertyMapService } from './plan-property-services';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import {PlanProperty} from '../interface/plan-property';


interface QueryParam {
  param: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class RunService extends ObjectCollectionService<PlanRun> {

  constructor(
    http: HttpClient,
    store: RunsStore,
    private planPropertyMapService: PlanPropertyMapService) {
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

  getBestRun(): Promise<PlanRun> {
    return new Promise<PlanRun>((resolve, reject) => {
      this.planPropertyMapService.getMap().subscribe(
        planProperties => {
          if (this.collection$.value.length === 0) {
            return resolve(null);
          }
          let bestRun = this.collection$.value[0];
          bestRun.planValue = computePlanValue(bestRun, planProperties);
          for (const run of this.collection$.value) {
            run.planValue = computePlanValue(run, planProperties);
            if (run.planValue >= bestRun.planValue) {
              bestRun = run;
            }
          }
          console.log('Best Run');
          console.log(bestRun);
          resolve(bestRun);
        }
      );
    });
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

  while (runs.length > 0) {
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

  constructor(
    http: HttpClient,
    store: RunsStore,
    planPropertyMapService: PlanPropertyMapService) {
    super(http, store, planPropertyMapService);
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

  constructor(
    store: CurrentRunStore,
    private fileUtilsService: PddlFileUtilsService,
    private taskSchemaService: TaskSchemaService,
    private planPropertyMapService: PlanPropertyMapService) {
    super(store);
  }

  saveObject(planRun: PlanRun) {
    console.log('Current run stored');
    if (planRun.planString && ! planRun.plan) {
      combineLatest([this.taskSchemaService.getSchema(), this.planPropertyMapService.getMap()]).subscribe(
        ([schema, planProperties]) => {
          if (schema) {
            planRun.planValue = computePlanValue(planRun, planProperties);
            console.log('PlanValue: ' + planRun.planValue);
            handlePlanString(planRun.planString, planRun, schema);
            this.selectedObjectStore.dispatch({type: LOAD, data: planRun});
          }
        });


    } else if (planRun.planPath && ! planRun.plan) {
      const planContent$ = this.fileUtilsService.getFileContent(planRun.planPath);
      // console.log('Loade Plan');
      combineLatest([this.taskSchemaService.getSchema(), planContent$, this.planPropertyMapService.getMap()]).subscribe(
        ([schema, content, planProperties]) => {
        // console.log(content);
        if (content) {
          planRun.planValue = computePlanValue(planRun, planProperties);
          handlePlanString(content, planRun, schema);
          this.selectedObjectStore.dispatch({type: LOAD, data: planRun});
        }
      });
    } else {
      this.selectedObjectStore.dispatch({type: LOAD, data: planRun});
    }
  }
}

function computePlanValue(planRun: PlanRun, planProperties: Map<string, PlanProperty>): number {
  let planValue = 0;
  for (const propName of planRun.hardGoals) {
    planValue += planProperties.get(propName).value;
  }
  for (const propName of planRun.satPlanProperties) {
    if (! planRun.hardGoals.find(p => p === propName)) {
      planValue += planProperties.get(propName).value;
    }
  }
  return planValue;
}

function handlePlanString(planString: string, planRun: PlanRun, schema: TaskSchema) {
  const lines = planString.split('\n');
  lines.splice(-1, 1); // remove empty line at the end
  const costString = lines.splice(-1, 1)[0];
  const plan = parsePlan(lines, schema);
  plan.cost = Number(costString.split(' ')[3]);
  planRun.plan = plan;
}

function parsePlan(actionStrings: string[], schema: TaskSchema): Plan {
  const res: Plan = {actions: [], cost: null};
  for (const a of actionStrings) {
    const action = a.replace('(', '').replace(')', '');
    const [name, ...args] = action.split(' ');
    if (schema.actions.some(ac => ac.name === name)) {
      res.actions.push({name, args});
    }
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
    protected planPropertiesService: PlanPropertyMapService
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


