import { PlanningTaskRelaxationService } from 'src/app/service/planning-task/planning-task-relaxations-services';
import { combineLatest } from 'rxjs';
import { PlanProperty } from 'src/app/interface/plan-property/plan-property';
import { Observable } from 'rxjs';
import { PlanPropertyMapService } from 'src/app/service/plan-properties/plan-property-services';
import { filter, map, take } from 'rxjs/operators';
import { USUser } from './../../interface/user-study/user-study-user';
import { ObjectCollectionService } from './../base/object-collection.service';
import { UserStudyCurrentDataStore, UserStudyDataStore } from './../../store/stores.store';
import { SelectedObjectService } from './../base/selected-object.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LOAD } from 'src/app/store/generic-item.store';
import { environment } from 'src/environments/environment';
import { IHTTPData } from 'src/app/interface/http-data.interface';
import { UserStudyData } from 'src/app/interface/user-study/user-study-store';
import { computeStepUtility, IterationStep } from 'src/app/interface/run';
import { LogEntry, LogEvent } from '../logger/time-logger.service';
import { mean, normalci, variance } from 'jstat'
import { PlanningTaskRelaxationSpace } from 'src/app/interface/planning-task-relaxation';

@Injectable({
  providedIn: 'root'
})
export class UserStudyCurrentDataService extends SelectedObjectService<UserStudyData> {

  BASE_URL = environment.apiURL + "user-study-data/";

constructor(private http: HttpClient, store: UserStudyCurrentDataStore) {
  super(store);
}


updateObject(data: UserStudyData) {

  //check if it's the same datapoint as in the store

  this.http
    .put<IHTTPData<UserStudyData>>(this.BASE_URL, {data: data})
    .subscribe((httpData) => {
      this.selectedObjectStore.dispatch({ type: LOAD, data: httpData.data });
    });
  }

}

export interface DataPoint {
  name: string,
  value: number
}

export interface LineChartData {
  name: string,
  series: {name: string, value: number, min?: number, max?: number}[]
}

function shortID(user: USUser): string {
  return user.prolificId !== "000000" ? user.prolificId : user._id.slice(-5);
}

@Injectable({
  providedIn: 'root'
})
export class UserStudyDataService extends ObjectCollectionService<UserStudyData> {

  BASE_URL = environment.apiURL + "user-study-data/";
  planProperties$: Observable<Map<string,PlanProperty>>;
  relaxationSpaces$: Observable<PlanningTaskRelaxationSpace[]>

  timeBuckets = [0,5,10,15,20,25,30];

  constructor(
    http: HttpClient,
    store: UserStudyDataStore,
    private planPropertiesService: PlanPropertyMapService,
    private relaxationSpacesService: PlanningTaskRelaxationService) {
    super(http, store);

    this.planProperties$ = planPropertiesService.getMap();
    this.relaxationSpaces$ = relaxationSpacesService.getList();
  }

  getIterationStepsPerUser(demoId: string, users: USUser[]): Promise<DataPoint[]> {
    return new Promise((resolve, reject) => {
      this.collection$.pipe(
        filter(d => !!d && d.length > 0),
        map(data => data.filter(d => users.some(u => u._id == d.user._id))),
        take(1)
      ).subscribe(data => {
          let dataPoints = [];
          for (const entry of data) {
            const steps: IterationStep[] = entry.demosData.find((e) => e.demo === demoId)?.iterationSteps;
            if (!steps) {
              const displayId = shortID(entry.user);
              dataPoints.push({
                name: displayId,
                value: 0
              });
              continue;
            }
            const displayId = shortID(entry.user);
            dataPoints.push({
              name: displayId,
              value: steps.length,
            });
          }
          resolve(dataPoints);
        }
      )
    });
  }

  getUtilityPerIterationStep(demoId: string, user: USUser): Promise<DataPoint[]> {
    console.log("getUtilityPerIterationStep");
    return new Promise((resolve, reject) => {
      combineLatest([this.collection$, this.planProperties$, this.relaxationSpaces$]).pipe(
        filter(([d, pp, rsp]) => !!d && d.length > 0 && !!pp && pp.size > 0 && !!rsp && rsp.length > 0),
        take(1)
      ).subscribe(([data, planProperties, relaxationSpaces]) => {
          data = data.filter(d => user._id == d.user._id);
          let dataPoints = [];
          const steps: IterationStep[] = data[0].demosData.find((e) => e.demo === demoId)?.iterationSteps;
          if (!steps) {
            resolve(dataPoints);
          }
          let firstStepTime = new Date(steps[0].createdAt).getTime();
          for(let step of steps){
            let v = computeStepUtility(step, planProperties, relaxationSpaces)
            dataPoints.push({
              name: (new Date(step.createdAt).getTime() - firstStepTime) / 1000 / 60,
              value: v ? v : 0,
            });
          }
          resolve(dataPoints);
        }
      )
    });
  }

  getMaxUtilityOverTime(demoId: string, user: USUser): Promise<LineChartData[]> {
    console.log("getUtilityPerIterationStep");
    return new Promise((resolve, reject) => {
      combineLatest([this.collection$, this.planProperties$, this.relaxationSpaces$]).pipe(
        filter(([d, pp, rsp]) => !!d && d.length > 0 && !!pp && pp.size > 0  && !!rsp && rsp.length > 0),
        take(1)
      ).subscribe(([data, planProperties, relaxationSpaces]) => {
          data = data.filter(d => user._id == d.user._id);
          let dataPoints = {name: user._id, series: []};
          const steps: IterationStep[] = data[0].demosData.find((e) => e.demo === demoId)?.iterationSteps;
          if (!steps) {
            resolve([dataPoints]);
          }
          let firstStepTime = new Date(steps[0].createdAt).getTime();
          let maxValues = this.timeBuckets.map(v => 0);

          for(let step of steps){
            let v = computeStepUtility(step, planProperties, relaxationSpaces);
            let t = (new Date(step.createdAt).getTime() - firstStepTime) / 1000 / 60;
            if(v){
              for(let i = 0; i < this.timeBuckets.length; i++){
                  if(this.timeBuckets[i] >= t){
                    maxValues[i] = maxValues[i] < v ? v : maxValues[i];
                  }
              }
            }
          }
          for(let i = 0; i < this.timeBuckets.length; i++){
            dataPoints.series.push({
              name: this.timeBuckets[i],
              value: maxValues[i]
            });
          }
          resolve([dataPoints]);
        }
      )
    });
  }

  getAverageMaxUtilityOverTime(demoId: string, users: USUser[]): Promise<LineChartData[]> {
    console.log("getUtilityPerIterationStep");
    return new Promise((resolve, reject) => {
      combineLatest([this.collection$, this.planProperties$, this.relaxationSpaces$]).pipe(
        filter(([d, pp, rsp]) => !!d && d.length > 0 && !!pp && pp.size > 0  && !!rsp && rsp.length > 0),
        take(1)
      ).subscribe(([data, planProperties, relaxationSpaces]) => {

          let filteredData = data.filter(d => users.some(u => u._id == d.user._id));
          let overallMaxValues = this.timeBuckets.map(v => []);

          for(let dataPoint of filteredData){

            const steps: IterationStep[] = dataPoint.demosData.find((e) => e.demo === demoId)?.iterationSteps;
            if (!steps) {
              continue
            }

            let firstStepTime = new Date(steps[0].createdAt).getTime();
            let maxValues = this.timeBuckets.map(v => 0);

            for(let step of steps){
              let v = computeStepUtility(step, planProperties, relaxationSpaces);
              let t = (new Date(step.createdAt).getTime() - firstStepTime) / 1000 / 60;
              if(v){
                for(let i = 0; i < this.timeBuckets.length; i++){
                    if(this.timeBuckets[i] >= t){
                      maxValues[i] = maxValues[i] < v ? v : maxValues[i];
                    }
                }
              }
            }

            maxValues.forEach((v,i) => overallMaxValues[i].push(v));
          }

          console.log(overallMaxValues);
          let plotData = {name: demoId, series: []};
          for(let i = 0; i < this.timeBuckets.length; i++){
            let meanV = mean(overallMaxValues[i])
            let varianceV = variance(overallMaxValues[i])
            let confI = normalci(meanV, 0.95, overallMaxValues[i]);
            plotData.series.push({
              name: this.timeBuckets[i],
              value: meanV,
              min: confI[0],
              max: confI[1]
            });
          }
          console.log(plotData);
          resolve([plotData]);
        }
      )
    });
  }

  getQuestionsPerUser(demoId: string, users: USUser[]): Promise<DataPoint[]> {
    return new Promise((resolve, reject) => {
      this.collection$.pipe(
        filter(d => !!d && d.length > 0),
        map(data => data.filter(d => users.some(u => u._id == d.user._id))),
        take(1)
      ).subscribe(data => {
          let dataPoints = [];
          for (const entry of data) {
            if(!entry.timeLog){
              const displayId = shortID(entry.user);
              dataPoints.push({
                name: displayId,
                value: 0
              });
              continue;
            }
            const logData: LogEntry[] = JSON.parse(entry.timeLog);

            let demoStartEntry = logData.filter(
              e => e.event === LogEvent.START_DEMO && e.info.demoId == demoId
            )[0];
            let demoFinishedeEntry = logData.filter(
              e => e.event === LogEvent.END_DEMO && e.info.demoId == demoId
            )[0];

            if (!demoStartEntry || !demoFinishedeEntry) {
              const displayId = shortID(entry.user);
              dataPoints.push({
                name: displayId,
                value: 0
              });
              continue;
            }

            const startDate = new Date(demoStartEntry.timeStamp);
            const endDate = new Date(demoFinishedeEntry.timeStamp);

            let questions = logData.filter(
              e => e.event === LogEvent.ASK_CONFLICT_QUESTION);

            questions = questions.filter(q => startDate <  new Date(q.timeStamp)
              &&  endDate >  new Date(q.timeStamp))

            const displayId = shortID(entry.user);
            dataPoints.push({
              name: displayId,
              value: questions.length
            });
          }
          resolve(dataPoints);
        }
      )
    });
  }

  getUtilityPerUser(demoId: string, users: USUser[]): Promise<DataPoint[]> {
    return new Promise((resolve, reject) => {
      this.collection$.pipe(
        filter(d => !!d && d.length > 0),
        map(data => data.filter(d => users.some(u => u._id == d.user._id))),
        take(1)
      ).subscribe(data => {
          let dataPoints = [];
          for (const entry of data) {
            if(!entry.timeLog){
              const displayId = shortID(entry.user);
              dataPoints.push({
                name: displayId,
                value: 0
              });
              continue;
            }
            const logData: LogEntry[] = JSON.parse(entry.timeLog);

            let demoEndEntry = logData.filter(
              e => e.event === LogEvent.END_DEMO && e.info.demoId == demoId
            )[0];

            if (!demoEndEntry || !demoEndEntry.info.max_utility) {
              const displayId = shortID(entry.user);
              dataPoints.push({
                name: displayId,
                value: 0
              });
              continue;
            }

            const displayId = shortID(entry.user);
            dataPoints.push({
              name: displayId,
              value: demoEndEntry.info.max_utility
            });
          }
          console.log(dataPoints);
          resolve(dataPoints);
        }
      )
    });
  }


  getProcessingTimePerUser(demoId: string, users: USUser[]): Promise<DataPoint[]> {
    return new Promise((resolve, reject) => {
      this.collection$.pipe(
        filter(d => !!d && d.length > 0),
        map(data => data.filter(d => users.some(u => u._id == d.user._id))),
        take(1)
      ).subscribe(data => {
          let dataPoints = [];
          for (const entry of data) {
            const steps: IterationStep[] = entry.demosData.find((e) => e.demo === demoId)?.iterationSteps;
            if (!steps) {
              const displayId = shortID(entry.user);
              dataPoints.push({
                name: displayId,
                value: 0
              });
              continue;
            }

            let startDate = new Date(steps[0].createdAt);
            let endDate = new Date(steps[steps.length - 1].createdAt);
            let diff = endDate.getTime() - startDate.getTime();

            const displayId = shortID(entry.user);
            dataPoints.push({
              name: displayId,
              value: diff / 1000 / 60,
            });
          }
          resolve(dataPoints);
        }
      )
    });
  }

  getProcessingTimeLogPerUser(demoId: string, users: USUser[]): Promise<DataPoint[]> {
    return new Promise((resolve, reject) => {
      this.collection$.pipe(
        filter(d => !!d && d.length > 0),
        map(data => data.filter(d => users.some(u => u._id == d.user._id))),
        take(1)
      ).subscribe(data => {
          let dataPoints = [];
          for (const entry of data) {
            if(!entry.timeLog){
              const displayId = shortID(entry.user);
              dataPoints.push({
                name: displayId,
                value: 0
              });
              continue;
            }
            const logData: LogEntry[] = JSON.parse(entry.timeLog);

            console.log(logData);
            let demoStartEntry = logData.filter(
              e => e.event === LogEvent.START_DEMO && e.info.demoId == demoId
            )[0];
            let demoFinishedeEntry = logData.filter(
              e => e.event === LogEvent.END_DEMO && e.info.demoId == demoId
            )[0];
            if (!demoStartEntry || !demoFinishedeEntry) {
              continue;
            }
            const startDate = new Date(demoStartEntry.timeStamp);
            const endDate = new Date(demoFinishedeEntry.timeStamp);
            const timeDiff = endDate.getTime() - startDate.getTime();

            const displayId = shortID(entry.user);
            dataPoints.push({
              name: displayId,
              value: timeDiff / 1000 / 60,
            });
          }
          resolve(dataPoints);
        }
      )
    });
  }

}
