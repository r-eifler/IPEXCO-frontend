import {DemosStore, RunningDemoStore} from '../../store/stores.store';
import {Demo, DemoDefinition} from '../../interface/demo';
import {Injectable} from '@angular/core';
import {ObjectCollectionService, QueryParam} from '../base/object-collection.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {IHTTPData} from '../../interface/http-data.interface';
import {ADD, EDIT, LOAD, REMOVE} from '../../store/generic-list.store';
import {SelectedObjectService} from '../base/selected-object.service';
import {PddlFileUtilsService} from '../files/pddl-file-utils.service';
import {GoalType, PlanProperty} from '../../interface/plan-property/plan-property';
import {combineLatest} from 'rxjs';
import {PlanPropertyMapService} from '../plan-properties/plan-property-services';


function updateMUGSPropsNames(demo: Demo, planProperties: Map<string, PlanProperty>) {
  const newMUGS = [];
  for (const mugs of demo.data.MUGS) {
    const list = [];
    for (const elem of mugs) {
      if (elem.startsWith('Atom')) {
        const fact = elem.replace('Atom ', '').replace(' ', '');
        let name = fact;
        for (const p of planProperties.values()) {
          if (p.type === GoalType.goalFact && fact === p.formula) {
            name = p.name;
            break;
          }
        }
        list.push(name);
      } else {
        list.push(elem.replace('sat_', '').replace('soft_accepting(', '').replace(')', ''));
      }
    }
    newMUGS.push(list);
  }
  demo.data.MUGS = newMUGS;
}

@Injectable({
  providedIn: 'root'
})
export class DemosService extends ObjectCollectionService<Demo> {

  constructor(
    http: HttpClient,
    store: DemosStore,
    private fileUtilsService: PddlFileUtilsService,
    private planPropertiesService: PlanPropertyMapService,
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
        // console.log('find: ' + this.BASE_URL);
        // console.log(res);
        for (const demo of demos) {
          const definitionContent$ = this.fileUtilsService.getFileContent(`${demo.definition}/demo.json`);
          combineLatest([definitionContent$, this.planPropertiesService.getMap()]).subscribe(
            ([content, planPropertiesMap]) => {
              // console.log(content);
              if (content) {
                demo.data = JSON.parse(content) as DemoDefinition;
                updateMUGSPropsNames(demo, planPropertiesMap); //Plan properties not yet loaded
                this.listStore.dispatch({type: EDIT, data: demo});
              }
            });
        }
        this.listStore.dispatch({type: LOAD, data: demos});
      });

    return this.collection$;
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

    // const formData = new FormData();
    // formData.append('name', demo.name);
    // // formData.append('summaryImage', demo.summaryImage);
    // formData.append('introduction', demo.introduction);

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

  // getNumOfProject(project: Project) {
  //   return this.collection$.value.filter(d => d.project === project._id).length;
  // }

}


@Injectable({
  providedIn: 'root'
})
export class RunningDemoService extends SelectedObjectService<Demo> {

  constructor(
    store: RunningDemoStore,
    private fileUtilsService: PddlFileUtilsService,
    private planPropertiesService: PlanPropertyMapService,
  ) {
    super(store);
  }



  saveObject(demo: Demo) {
    if (demo.definition) {
      const definitionContent$ = this.fileUtilsService.getFileContent(`${demo.definition}/demo.json`);
      combineLatest([definitionContent$, this.planPropertiesService.getMap()]).subscribe(
        ([content, planPropertiesMap]) => {
        // console.log(content);
        if (content) {
          const demoDef = JSON.parse(content) as DemoDefinition;
          demo.data = demoDef;
          updateMUGSPropsNames(demo, planPropertiesMap);
          this.selectedObjectStore.dispatch({type: LOAD, data: demo});
        }
      });

    }
  }

}
