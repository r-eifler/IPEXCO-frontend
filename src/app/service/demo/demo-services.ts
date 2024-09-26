import { take } from "rxjs/operators";
import { DemosStore, RunningDemoStore } from "../../store/stores.store";
import { Demo } from "../../interface/demo";
import { Injectable } from "@angular/core";
import { ObjectCollectionService, QueryParam } from "../base/object-collection.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { IHTTPData } from "../../interface/http-data.interface";
import { ADD, EDIT, LOAD, REMOVE } from "../../store/generic-list.store";
import { RunStatus } from "src/app/interface/run";
import { BaseProjectService, CurrentProjectService } from "../project/project-services";
import { PlanPropertyMapService } from "../plan-properties/plan-property-services";
import { IterationStepsService } from "../planner-runs/iteration-steps.service";


@Injectable({
  providedIn: "root",
})
export class DemosService extends ObjectCollectionService<Demo> {
  constructor(http: HttpClient, store: DemosStore) {
    super(http, store);
    this.BASE_URL = environment.apiURL + "demo/";
  }

  findCollection(queryParams: QueryParam[] = []) {
    // console.log('find: ' + this.BASE_URL);
    let httpParams = new HttpParams();
    for (const qp of queryParams) {
      httpParams = httpParams.set(qp.param, qp.value);
    }

    this.http
      .get<IHTTPData<Demo[]>>(this.BASE_URL, { params: httpParams })
      .pipe(this.pipeFindData, this.pipeFind)
      .subscribe((demos) => {
        this.listStore.dispatch({ type: LOAD, data: demos });
      });

    return this.collection$;
  }

  static sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  async updateDemoComputationCompletion(demo: Demo): Promise<void> {
    await DemosService.sleep(60 * 1000);
    console.log("updateDemoComputationCompletion");
    this.http
      .get<IHTTPData<Demo>>(this.BASE_URL + demo._id)
      .pipe(this.pipeGetData, this.pipeGet)
      .pipe(take(1))
      .subscribe((demo) => {
        console.log(demo);
        let action = { type: EDIT, data: demo };
        this.listStore.dispatch(action);
        console.log(demo.completion);
        if (demo.completion != 1 && demo.status == RunStatus.running) {
          this.updateDemoComputationCompletion(demo);
        }
      });
  }

  generateDemo(projectId: string, demo: Demo): void {
    const formData = new FormData();
    formData.append("name", demo.name);
    formData.append("summaryImage", demo.summaryImage);
    formData.append("introduction", demo.introduction);
    formData.append("description", demo.description);
    formData.append("projectId", projectId);

    // console.log('summaryImage: '  + demo.summaryImage);

    this.http
      .post<IHTTPData<Demo>>(this.BASE_URL, formData)
      .subscribe((httpData) => {
        const runLoaded = this.existsObjectInStore(httpData.data._id);
        let action = null;
        if (runLoaded) {
          action = { type: EDIT, data: httpData.data };
        } else {
          action = { type: ADD, data: httpData.data };
        }
        this.listStore.dispatch(action);
        this.updateDemoComputationCompletion(httpData.data);
      });
  }

  addPrecomputedDemo(
    projectId: string,
    demo: Demo,
    demoData: string,
    maxUtilityData: string
  ): void {
    const formData = new FormData();
    formData.append("name", demo.name);
    formData.append("summaryImage", demo.summaryImage);
    formData.append("introduction", demo.introduction);
    formData.append("description", demo.description);
    formData.append("projectId", projectId);
    formData.append("demoData", demoData);
    formData.append("maxUtility", maxUtilityData);

    // console.log('summaryImage: '  + demo.summaryImage);

    this.http
      .post<IHTTPData<Demo>>(this.BASE_URL + "/precomputed", formData)
      .subscribe((httpData) => {
        console.log(httpData.data)
        const runLoaded = this.existsObjectInStore(httpData.data._id);
        let action = null;
        if (runLoaded) {
          action = { type: EDIT, data: httpData.data };
        } else {
          action = { type: ADD, data: httpData.data };
        }
        this.listStore.dispatch(action);
      });
  }

  updateDemo(demo: Demo, updateImage = false): void {
    this.http
      .put<IHTTPData<Demo>>(`${this.BASE_URL}/${demo._id}`, {data: demo})
      .subscribe((httpData) => {
        const action = { type: EDIT, data: httpData.data };
        this.listStore.dispatch(action);
        if(updateImage)
          this.updateDemoImage(demo);
      });
  }

  updateDemoImage(demo: Demo): void {

    const formData = new FormData();
    formData.append("summaryImage", demo.summaryImage);

    this.http
      .post<IHTTPData<Demo>>(`${this.BASE_URL}/${demo._id}/image`, formData)
      .subscribe((httpData) => {
        console.log(httpData);
        console.log(httpData.data);
        const runLoaded = this.existsObjectInStore(httpData.data._id);
        let action = null;
        if (runLoaded) {
          action = { type: EDIT, data: httpData.data };
        } else {
          action = { type: ADD, data: httpData.data };
        }
        this.listStore.dispatch(action);
      });
  }

  cancelDemo(demo: Demo): Promise<boolean> {
    const p = new Promise<boolean>((resolve, reject) => {
      this.http
        .post<{ data: Demo; successful: boolean }>(
          `${this.BASE_URL}cancel/${demo._id}`,
          demo
        )
        .subscribe((httpData) => {
          this.listStore.dispatch({ type: REMOVE, data: demo });
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
  providedIn: "root",
})
export class RunningDemoService extends CurrentProjectService {
  constructor( 
      store: RunningDemoStore,
      propertiesService: PlanPropertyMapService,
      runsService: IterationStepsService,) {
    super(store, propertiesService,runsService);
  }

  saveObject(demo: Demo) {
    this.selectedObjectStore.dispatch({ type: LOAD, data: demo });
    console.log(demo);

    this.runsService.reset()
    this.runsService.findCollection([
      { param: "projectId", value: demo._id },
    ]);
    this.propertiesService.findCollection([
      { param: "projectId", value: demo._id },
    ]);
  }
}
