import { PlanningTaskRelaxationSpace } from './../../interface/planning-task-relaxation';
import { PlanProperty } from 'src/app/interface/plan-property/plan-property';
import { PlanningTaskRelaxationService } from 'src/app/service/planning-task/planning-task-relaxations-services';
import { DemoIterationStepsService } from './../planner-runs/demo-iteration-steps.service';
import { take, filter, flatMap, map } from 'rxjs/operators';
import {DemosStore, RunningDemoStore} from '../../store/stores.store';
import {Demo} from '../../interface/demo';
import {Injectable} from '@angular/core';
import {ObjectCollectionService, QueryParam} from '../base/object-collection.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {IHTTPData} from '../../interface/http-data.interface';
import {ADD, EDIT, LOAD, REMOVE} from '../../store/generic-list.store';
import {SelectedObjectService} from '../base/selected-object.service';
import {PlanPropertyMapService} from '../plan-properties/plan-property-services';
import { IterationStep, RunStatus, StepStatus } from 'src/app/interface/run';
import { ModifiedPlanningTask } from 'src/app/interface/planning-task-relaxation';
import { combineLatest, Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class DemosService extends ObjectCollectionService<Demo> {

  constructor(
    http: HttpClient,
    store: DemosStore
  ) {
    super(http, store);
    this.BASE_URL = environment.apiURL + 'demo/';
  }

  findCollection(queryParams: QueryParam[] = []) {
    // console.log('find: ' + this.BASE_URL);
    let httpParams = new HttpParams();
    for ( const  qp of queryParams) {
      httpParams = httpParams.set(qp.param, qp.value);
    }

    this.http.get<IHTTPData<Demo[]>>(this.BASE_URL, {params: httpParams})
      .pipe(this.pipeFindData, this.pipeFind)
      .subscribe((demos) => {
        console.log(demos);
        this.listStore.dispatch({type: LOAD, data: demos});
      });

    return this.collection$;
  }

  static sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
   }

  async updateDemoComputationCompletion(demo: Demo): Promise<void> {
    await DemosService.sleep(60 * 1000);
    console.log("updateDemoComputationCompletion");
    this.http.get<IHTTPData<Demo>>(this.BASE_URL + demo._id).
    pipe(this.pipeGetData, this.pipeGet).pipe(take(1)).
    subscribe(demo => {
      let action = {type: EDIT, data: demo};
      this.listStore.dispatch(action);
      console.log(demo.completion);
      if(demo.completion != 1 && demo.status == RunStatus.running){
        this.updateDemoComputationCompletion(demo);
      }
    });

  }

  generateDemo(projectId: string, demo: Demo): void {

    const formData = new FormData();
    formData.append('name', demo.name);
    formData.append('summaryImage', demo.summaryImage);
    formData.append('introduction', demo.introduction);
    formData.append('description', demo.description);
    formData.append('projectId', projectId);

    // console.log('summaryImage: '  + demo.summaryImage);

    this.http.post<IHTTPData<Demo>>(this.BASE_URL, formData)
      .subscribe(httpData => {
        const runLoaded = this.existsObjectInStore(httpData.data._id);
        let action = null;
        if (runLoaded) {
          action = {type: EDIT, data: httpData.data};
        } else {
          action = {type: ADD, data: httpData.data};
        }
        this.listStore.dispatch(action);
        this.updateDemoComputationCompletion(httpData.data);
      });

  }

  addPrecomputedDemo(projectId: string, demo: Demo, demoData: string, maxUtilityData: string): void {

    const formData = new FormData();
    formData.append('name', demo.name);
    formData.append('summaryImage', demo.summaryImage);
    formData.append('introduction', demo.introduction);
    formData.append('description', demo.description);
    formData.append('projectId', projectId);
    formData.append('demoData', demoData);
    formData.append('maxUtility', maxUtilityData);

    // console.log('summaryImage: '  + demo.summaryImage);

    this.http.post<IHTTPData<Demo>>(this.BASE_URL + '/precomputed', formData)
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

  updateDemo(demo: Demo): void {

    this.http.put<IHTTPData<Demo>>(this.BASE_URL, demo)
      .subscribe(httpData => {
        const action = {type: EDIT, data: httpData.data};
        this.listStore.dispatch(action);
      });
  }

  cancelDemo(demo: Demo): Promise<boolean> {
    const p = new Promise<boolean>((resolve, reject) => {
      this.http.post<{data: Demo, successful: boolean}>(`${this.BASE_URL}cancel/${demo._id}`, demo)
      .subscribe(httpData => {
        this.listStore.dispatch({type: REMOVE, data: demo});
        resolve(httpData.successful);
      });
    });
    return p;
  }


  getNum(): number {
    return this.collection$.value.length;
  }

}


@Injectable({
  providedIn: 'root'
})
export class RunningDemoService extends SelectedObjectService<Demo> {

  planProperties$: Observable<Map<string, PlanProperty>>;
  relaxationSpaces$: Observable<PlanningTaskRelaxationSpace[]>;

  constructor(
    store: RunningDemoStore,
    private planPropertiesService: PlanPropertyMapService,
    private planningTaskRelaxationService: PlanningTaskRelaxationService,
    private iterationStepsService: DemoIterationStepsService
  ) {
    super(store);

    this.planProperties$ = this.planPropertiesService.getMap();
    this.relaxationSpaces$ = this.planningTaskRelaxationService.getList();
  }

  saveObject(demo: Demo) {
    this.selectedObjectStore.dispatch({type: LOAD, data: demo});

    console.log(demo);
    this.iterationStepsService.reset();

    combineLatest([this.planProperties$, this.relaxationSpaces$]).
      pipe(filter(([ppM, spaces]) => !!ppM && ppM.size > 0 && !!spaces && spaces.length > 0), take(1)).subscribe(
      ([planProperties, relaxationSpaces]) => {
          console.log("Generate initial Iteration Step");
          console.log("#planProperties: " + planProperties.size);
          let softGoals = [];
          let hardGoals = [];
          for (const pp of planProperties.values()) {
            if (pp.globalHardGoal) {
              hardGoals.push(pp._id);
            }
            else {
              softGoals.push(pp._id);
            }
          }
          let initUpdates = [];
          relaxationSpaces.forEach(space => space.dimensions.forEach(
            dim => initUpdates.push({orgFact: dim.orgFact.fact, newFact: dim.orgFact.fact})))
          let newTask: ModifiedPlanningTask = {
            name: 'task',
            project:demo._id,
            basetask: demo.baseTask,
            initUpdates
          };
          let newStep: IterationStep = {
            name: "Itertaion Step 1",
            project: demo._id,
            status: StepStatus.unknown,
            hardGoals: [...hardGoals],
            softGoals: [...softGoals],
            task: newTask};
          console.log("New Step");
          console.log(newStep);
          this.iterationStepsService.saveObject(newStep);
      }
    )
  }

}
