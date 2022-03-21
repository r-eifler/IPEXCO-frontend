import { ModifiedPlanningTask } from './../../interface/planning-task-relaxation';
import { SelectedIterationStepService } from './selected-iteration-step.service';
import { CurrentProjectService } from 'src/app/service/project/project-services';
import { IterationStepsStore, CurrentIterationStepStore } from './../../store/stores.store';
import { IterationStep, StepStatus } from './../../interface/run';
import {EDIT, LOAD, REMOVE} from '../../store/generic-list.store';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {RunsStore} from '../../store/stores.store';
import {ObjectCollectionService} from '../base/object-collection.service';
import {environment} from '../../../environments/environment';
import {IHTTPData} from '../../interface/http-data.interface';
import {DepExplanationRun, PlanRun} from '../../interface/run';
import {PlanPropertyMapService} from '../plan-properties/plan-property-services';
import {combineLatest } from 'rxjs';


interface QueryParam {
  param: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class IterationStepsService extends ObjectCollectionService<IterationStep> {

  constructor(
    http: HttpClient,
    store: IterationStepsStore,
    private workingIterationStepService: SelectedIterationStepService,
    private selectedProjectService: CurrentProjectService,
    private planPropertiesService: PlanPropertyMapService) {
    super(http, store);
    this.BASE_URL = environment.apiURL + 'run/iter-step/';
    // this.pipeFind = map(sortRuns);

    }

    findCollection(queryParams: QueryParam[] = []) {
      // console.log('find: ' + this.BASE_URL);
      let httpParams = new HttpParams();
      for ( const  qp of queryParams) {
        httpParams = httpParams.set(qp.param, qp.value);
      }

      this.http.get<IHTTPData<IterationStep[]>>(this.BASE_URL, {params: httpParams})
        .pipe(this.pipeFindData, this.pipeFind)
        .subscribe((res) => {
          // console.log('find: ' + this.BASE_URL);
          // console.log(res);
          if(res.length == 0){
            let obs = combineLatest(this.selectedProjectService.findSelectedObject(), this.planPropertiesService.getMap())
            .subscribe(
              ([project, planPropertiesMap]) => {
                let modTask: ModifiedPlanningTask = {name: 'init', project: project._id, basetask: project.baseTask, taskUpdatList: []};
                let initial_step = new IterationStep('Initial Step', project._id,
                StepStatus.unknown, Array.from(planPropertiesMap.values()).filter(pp => pp.globalHardGoal),
                Array.from(planPropertiesMap.values()).filter(pp => ! pp.globalHardGoal), modTask)
                this.workingIterationStepService.saveObject(initial_step);
              }
            );
          }
          else{
            this.workingIterationStepService.saveObject(res[res.length-1])
          }

          this.listStore.dispatch({type: LOAD, data: res});
        });

      return this.collection$;
    }

  deleteExpRun(expRun: IterationStep) {
    return this.http.delete<IHTTPData<PlanRun>>( environment.apiURL + 'run/explanation/' + expRun._id)
      .subscribe(response => {
        this.listStore.dispatch({type: EDIT, data: response.data});
      });
  }

  getLastRun(): IterationStep {
    const lastValues: IterationStep[] = this.collection$.value;
    if (lastValues.length > 0) {
      return lastValues[lastValues.length - 1 ];
    } else {
      return null;
    }
  }

  getBestRun(): IterationStep {
    if(this.collection$.value.length == 0){
      return null
    }
    return this.collection$.value.reduce((max, cur) => cur.planValue() >= max.planValue() ? cur : max, this.collection$.value[0])
  }

  getNumRuns(): number {
    return this.collection$.value.length;
  }

  getNumQuestions(): number {
    let res = 0;
    for (const r of this.collection$.value) {
      res += r.depExplanations.length;
    }
    return res;
  }

  reset() {
    this.listStore.reset();
  }

}





