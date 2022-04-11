import { computePlanValue } from 'src/app/interface/run';
import { ModifiedPlanningTask } from './../../interface/planning-task-relaxation';
import { SelectedIterationStepService } from './selected-iteration-step.service';
import { CurrentProjectService } from 'src/app/service/project/project-services';
import { IterationStepsStore } from './../../store/stores.store';
import { IterationStep, StepStatus, ModIterationStep, PlanRun } from './../../interface/run';
import {ADD, EDIT, LOAD, REMOVE} from '../../store/generic-list.store';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ObjectCollectionService} from '../base/object-collection.service';
import {environment} from '../../../environments/environment';
import {IHTTPData} from '../../interface/http-data.interface';
import {PlanPropertyMapService} from '../plan-properties/plan-property-services';
import {combineLatest } from 'rxjs';
import { PlanProperty } from 'src/app/interface/plan-property/plan-property';


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
    private selectedIterationStepService: SelectedIterationStepService,
    private selectedProjectService: CurrentProjectService,
    private planPropertiesService: PlanPropertyMapService) {
    super(http, store);
    this.BASE_URL = environment.apiURL + 'run/iter-step/';
    // this.pipeFind = map(sortRuns);

    }

    saveObject(step: IterationStep) {

      if (step._id) {
        console.log('edit');
        return this.http.put<IHTTPData<IterationStep>>(this.BASE_URL + step._id, {data: step})
          .subscribe(httpData => {
            const action = {type: EDIT, data: httpData.data};
            this.listStore.dispatch(action);
          });
      }

      return this.http.post<IHTTPData<IterationStep>>(this.BASE_URL, {data: step})
        .subscribe(httpData => {
          let rStep = httpData.data
          this.selectedIterationStepService.saveObject(rStep);
          const action = {type: ADD, data: rStep};
          this.listStore.dispatch(action);
        });
    }

    findCollection(queryParams: QueryParam[] = []) {
      // console.log('find: ' + this.BASE_URL);
      let httpParams = new HttpParams();
      for ( const  qp of queryParams) {
        httpParams = httpParams.set(qp.param, qp.value);
      }

      this.http.get<IHTTPData<IterationStep[]>>(this.BASE_URL, {params: httpParams})
        .pipe(this.pipeFindData, this.pipeFind)
        .subscribe((steps) => {
          console.log(steps);
          if(steps.length == 0){
            let obs = combineLatest([this.selectedProjectService.findSelectedObject(), this.planPropertiesService.getMap()])
            .subscribe(
              ([project, planPropertiesMap]) => {
                if (project && planPropertiesMap.size > 0){

                  let modTask: ModifiedPlanningTask = {name: 'init', project: project._id, basetask: project.baseTask, initUpdates: []};

                  let globalHardGoals : string [] = [];
                  for(let pp of planPropertiesMap.values()){
                    if(pp.globalHardGoal){
                      globalHardGoals.push(pp._id);
                    }
                  }

                  let initial_step : IterationStep = {
                    name: 'Initial Step',
                    project: project._id,
                    status: StepStatus.unknown,
                    hardGoals: globalHardGoals,
                    softGoals: [],
                    task: modTask}
                  let initalModStep : ModIterationStep= {
                    name: 'Initial Step',
                    baseStep: initial_step,
                    project: project._id,
                    status: StepStatus.unknown,
                    hardGoals: globalHardGoals,
                    softGoals: [],
                    task: modTask}

                  this.selectedIterationStepService.saveObject(initalModStep);
                  // obs.unsubscribe(); TODO
                }
              }
            );
          }
          else{
            this.selectedIterationStepService.saveObject(steps[steps.length-1])
          }

          this.listStore.dispatch({type: LOAD, data: steps});
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

  getBestRun(planProperties: Map<string, PlanProperty>): IterationStep {
    if(this.collection$.value.length == 0){
      return null
    }
    return this.collection$.value.reduce((max, cur) => computePlanValue(cur, planProperties) >= computePlanValue(cur, planProperties) ? cur : max, this.collection$.value[0])
  }

  getNumRuns(): number {
    return this.collection$.value.length;
  }

  getNumQuestions(): number {
    let res = 0;
    for (const r of this.collection$.value) {
      if(r.depExplanations)
        res += r.depExplanations.length;
    }
    return res;
  }

  reset() {
    this.listStore.reset();
  }

  deleteObject(object: IterationStep) {
    let index = this.collection$.getValue().indexOf(object);
    return this.http.delete(this.BASE_URL + object._id)
      .subscribe(response => {
        this.listStore.dispatch({type: REMOVE, data: object});
        if(index < this.collection$.getValue().length){
          this.selectedIterationStepService.saveObject(this.collection$.getValue()[index]);
          return
        }
        this.selectedIterationStepService.saveObject(this.collection$.getValue()[this.collection$.getValue().length - 1]);
      });
  }

}





