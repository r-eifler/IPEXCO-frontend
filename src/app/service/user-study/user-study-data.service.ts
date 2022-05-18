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
import { IterationStep } from 'src/app/interface/run';
import { LogEntry, LogEvent } from '../logger/time-logger.service';

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

function shortID(user: USUser): string {
  return user.prolificId !== "000000" ? user.prolificId : user._id.slice(-5);
}

@Injectable({
  providedIn: 'root'
})
export class UserStudyDataService extends ObjectCollectionService<UserStudyData> {

  BASE_URL = environment.apiURL + "user-study-data/";

  constructor(http: HttpClient, store: UserStudyDataStore) {
    super(http, store);
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
