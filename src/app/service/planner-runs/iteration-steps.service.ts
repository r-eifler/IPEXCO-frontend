import {EDIT, REMOVE} from '../../store/generic-list.store';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RunsStore} from '../../store/stores.store';
import {ObjectCollectionService} from '../base/object-collection.service';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {IHTTPData} from '../../interface/http-data.interface';
import {ExplanationRun, PlanRun} from '../../interface/run';
import {PlanPropertyMapService} from '../plan-properties/plan-property-services';
import {computePlanValue} from './utils';


interface QueryParam {
  param: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class IterationStepsService extends ObjectCollectionService<PlanRun> {

  constructor(
    http: HttpClient,
    store: RunsStore,
    private planPropertyMapService: PlanPropertyMapService) {
    super(http, store);
    this.BASE_URL = environment.apiURL + 'run/iter-step/';
    // this.pipeFind = map(sortRuns);

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
          resolve(bestRun);
        }
      );
    });
  }

  getPlanUtility(planRun: PlanRun): number {
      const planProperties = this.planPropertyMapService.getMap().value;
      if (planProperties.size === 0) {
        // console.log('No plan properties');
        return 0;
      }
      const utility = computePlanValue(planRun, planProperties);
      return utility;
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

  return sorted;
}

function findStart(runs: PlanRun[]): PlanRun {
  for (const run of runs) {
    if (run.previousRun == null) {
      return run;
    }
  }
}



