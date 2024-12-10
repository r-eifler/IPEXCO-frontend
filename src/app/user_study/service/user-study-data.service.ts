// import { combineLatest } from 'rxjs';
// import { Observable } from 'rxjs';
// import { filter, map, take } from 'rxjs/operators';
// import { USUser } from '../../interface/user-study/user-study-user';
// import { ObjectCollectionService } from '../../service/base/object-collection.service';
// import { inject, Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { environment } from 'src/environments/environment';
// import { IHTTPData } from 'src/app/interface/http-data.interface';
// import { UserStudyData } from 'src/app/interface/user-study/user-study-store';
// import { LogEntry, LogEvent } from '../../service/logger/time-logger.service';
// import { IterationStep } from 'src/app/iterative_planning/domain/iteration_step';
// import { PlanProperty } from 'src/app/shared/domain/plan-property/plan-property';
// import { number } from 'zod';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserStudyCurrentDataService {

//   private http = inject(HttpClient)
//   BASE_URL = environment.apiURL + "user-study-data/";


// updateObject(data: UserStudyData) {

//   //check if it's the same datapoint as in the store

//   this.http
//     .put<IHTTPData<UserStudyData>>(this.BASE_URL, {data: data})
//     .subscribe((httpData) => {
//       // this.selectedObjectStore.dispatch({ type: LOAD, data: httpData.data });
//     });
//   }

// }

// export interface DataPoint {
//   name: string,
//   value: number
// }

// export interface LineChartData {
//   name: string,
//   series: {name: string, value: number, min?: number, max?: number}[]
// }

// function shortID(user: USUser): string {
//   return user.prolificId !== "000000" ? user.prolificId : user._id.slice(-5);
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class UserStudyDataService extends ObjectCollectionService<UserStudyData> {

//   BASE_URL = environment.apiURL + "user-study-data/";
//   planProperties$: Observable<Map<string,PlanProperty>>;

//   timeBuckets = [0,5,10,15,20,25,30];

//   constructor(
//     http: HttpClient,
//     // store: UserStudyDataStore,
//     // private planPropertiesService: PlanPropertyMapService
//   ) {
//     super(http);

//     this.planProperties$ = planPropertiesService.getMap();
//   }

//   getIterationStepsPerUser(demoId: string, users: USUser[]): Promise<DataPoint[]> {
//     return new Promise((resolve, reject) => {
//       this.collection$.pipe(
//         filter(d => !!d && d.length > 0),
//         map(data => data.filter(d => users.some(u => u._id == d.user._id))),
//         take(1)
//       ).subscribe(data => {
//           let dataPoints = [];
//           for (const entry of data) {
//             const steps: IterationStep[] = entry.demosData.find((e) => e.demo === demoId)?.iterationSteps;
//             if (!steps) {
//               const displayId = shortID(entry.user);
//               dataPoints.push({
//                 name: displayId,
//                 value: 0
//               });
//               continue;
//             }
//             const displayId = shortID(entry.user);
//             dataPoints.push({
//               name: displayId,
//               value: steps.length,
//             });
//           }
//           resolve(dataPoints);
//         }
//       )
//     });
//   }

//   // getUtilityPerIterationStep(demoId: string, user: USUser): Promise<DataPoint[]> {
//   //   console.log("getUtilityPerIterationStep");
//   //   return new Promise((resolve, reject) => {
//   //     combineLatest([this.collection$, this.planProperties$]).pipe(
//   //       filter(([d, pp]) => !!d && d.length > 0 && !!pp && pp.size > 0),
//   //       take(1)
//   //     ).subscribe(([data, planProperties]) => {
//   //         data = data.filter(d => user._id == d.user._id);
//   //         let dataPoints = [];
//   //         const steps: IterationStep[] = data[0].demosData.find((e) => e.demo === demoId)?.iterationSteps;
//   //         if (!steps) {
//   //           resolve(dataPoints);
//   //         }
//   //         let firstStepTime = new Date(steps[0].createdAt).getTime();
//   //         for(let step of steps){
//   //           let v = 0 // TODO computeStepUtility(step, planProperties)
//   //           dataPoints.push({
//   //             name: (new Date(step.createdAt).getTime() - firstStepTime) / 1000 / 60,
//   //             value: v ? v : 0,
//   //           });
//   //         }
//   //         resolve(dataPoints);
//   //       }
//   //     )
//   //   });
//   // }

//   // getMaxUtilityOverTime(demoId: string, user: USUser): Promise<LineChartData[]> {
//   //   console.log("getUtilityPerIterationStep");
//   //   return new Promise((resolve, reject) => {
//   //     combineLatest([this.collection$, this.planProperties$]).pipe(
//   //       filter(([d, pp]) => !!d && d.length > 0 && !!pp && pp.size > 0),
//   //       take(1)
//   //     ).subscribe(([data, planProperties]) => {
//   //         data = data.filter(d => user._id == d.user._id);
//   //         let dataPoints: {name: string, series: number[]} = {name: user._id, series: []};
//   //         const steps: IterationStep[] | undefined = data[0].demosData.find((e) => e.demo === demoId)?.iterationSteps;
//   //         if (!steps) {
//   //           resolve([dataPoints]);
//   //         }
//   //         let firstStepTime = new Date(steps[0].createdAt).getTime();
//   //         let maxValues = this.timeBuckets.map(v => 0);

//   //         for(let step of steps){
//   //           let v = 0 //TODO computeStepUtility(step, planProperties);
//   //           let t = (new Date(step.createdAt).getTime() - firstStepTime) / 1000 / 60;
//   //           if(v){
//   //             for(let i = 0; i < this.timeBuckets.length; i++){
//   //                 if(this.timeBuckets[i] >= t){
//   //                   maxValues[i] = maxValues[i] < v ? v : maxValues[i];
//   //                 }
//   //             }
//   //           }
//   //         }
//   //         for(let i = 0; i < this.timeBuckets.length; i++){
//   //           dataPoints.series.push({
//   //             name: this.timeBuckets[i] ? this.timeBuckets[i] : 'NO NAME',
//   //             value: maxValues[i]
//   //           });
//   //         }
//   //         resolve([dataPoints]);
//   //       }
//   //     )
//   //   });
//   // }

//   getAverageMaxUtilityOverTime(demoId: string, users: USUser[]): Promise<LineChartData[]> {
//     console.log("getUtilityPerIterationStep");
//     return new Promise((resolve, reject) => {
//       combineLatest([this.collection$, this.planProperties$]).pipe(
//         filter(([d, pp]) => !!d && d.length > 0 && !!pp && pp.size > 0),
//         take(1)
//       ).subscribe(([data, planProperties]) => {

//           let filteredData = data.filter(d => users.some(u => u._id == d.user._id));
//           let overallMaxValues: number[][] = this.timeBuckets.map(v => []);

//           for(let dataPoint of filteredData){

//             const steps: IterationStep[] | undefined = dataPoint.demosData.find((e) => e.demo === demoId)?.iterationSteps;
//             if (!steps) {
//               continue
//             }

//             const createdAt = steps[0].createdAt ? steps[0].createdAt : 0;

//             let firstStepTime = new Date(createdAt).getTime();
//             let maxValues = this.timeBuckets.map(v => 0);

//             for(let step of steps){
//               let v = 0 //TODO computeStepUtility(step, planProperties);
//               let t = (new Date(createdAt).getTime() - firstStepTime) / 1000 / 60;
//               if(v){
//                 for(let i = 0; i < this.timeBuckets.length; i++){
//                     if(this.timeBuckets[i] >= t){
//                       maxValues[i] = maxValues[i] < v ? v : maxValues[i];
//                     }
//                 }
//               }
//             }

//             maxValues.forEach((v,i) => overallMaxValues[i].push(v));
//           }

//           console.log(overallMaxValues);
//           let plotData = {name: demoId, series: []};
//           for(let i = 0; i < this.timeBuckets.length; i++){
//             // let meanV = mean(overallMaxValues[i])
//             // let varianceV = variance(overallMaxValues[i])
//             // let confI = normalci(meanV, 0.95, overallMaxValues[i]);
//             // plotData.series.push({
//             //   name: this.timeBuckets[i],
//             //   value: meanV,
//             //   min: confI[0],
//             //   max: confI[1]
//             // });
//           }
//           console.log(plotData);
//           resolve([plotData]);
//         }
//       )
//     });
//   }

//   getQuestionsPerUser(demoId: string, users: USUser[]): Promise<DataPoint[]> {
//     return new Promise((resolve, reject) => {
//       this.collection$.pipe(
//         filter(d => !!d && d.length > 0),
//         map(data => data.filter(d => users.some(u => u._id == d.user._id))),
//         take(1)
//       ).subscribe(data => {
//           let dataPoints = [];
//           for (const entry of data) {
//             if(!entry.timeLog){
//               const displayId = shortID(entry.user);
//               dataPoints.push({
//                 name: displayId,
//                 value: 0
//               });
//               continue;
//             }
//             const logData: LogEntry[] = JSON.parse(entry.timeLog);

//             let demoStartEntry = logData.filter(
//               e => e.event === LogEvent.START_DEMO && e.info.demoId == demoId
//             )[0];
//             let demoFinishedeEntry = logData.filter(
//               e => e.event === LogEvent.END_DEMO && e.info.demoId == demoId
//             )[0];

//             if (!demoStartEntry || !demoFinishedeEntry) {
//               const displayId = shortID(entry.user);
//               dataPoints.push({
//                 name: displayId,
//                 value: 0
//               });
//               continue;
//             }

//             const startDate = new Date(demoStartEntry.timeStamp);
//             const endDate = new Date(demoFinishedeEntry.timeStamp);

//             let questions = logData.filter(
//               e => e.event === LogEvent.ASK_CONFLICT_QUESTION);

//             questions = questions.filter(q => startDate <  new Date(q.timeStamp)
//               &&  endDate >  new Date(q.timeStamp))

//             const displayId = shortID(entry.user);
//             dataPoints.push({
//               name: displayId,
//               value: questions.length
//             });
//           }
//           resolve(dataPoints);
//         }
//       )
//     });
//   }

//   getUtilityPerUser(demoId: string, users: USUser[]): Promise<DataPoint[]> {
//     return new Promise((resolve, reject) => {
//       this.collection$.pipe(
//         filter(d => !!d && d.length > 0),
//         map(data => data.filter(d => users.some(u => u._id == d.user._id))),
//         take(1)
//       ).subscribe(data => {
//           let dataPoints = [];
//           for (const entry of data) {
//             if(!entry.timeLog){
//               const displayId = shortID(entry.user);
//               dataPoints.push({
//                 name: displayId,
//                 value: 0
//               });
//               continue;
//             }
//             const logData: LogEntry[] = JSON.parse(entry.timeLog);

//             let demoEndEntry = logData.filter(
//               e => e.event === LogEvent.END_DEMO && e.info.demoId == demoId
//             )[0];

//             if (!demoEndEntry || !demoEndEntry.info.max_utility) {
//               const displayId = shortID(entry.user);
//               dataPoints.push({
//                 name: displayId,
//                 value: 0
//               });
//               continue;
//             }

//             const displayId = shortID(entry.user);
//             dataPoints.push({
//               name: displayId,
//               value: demoEndEntry.info.max_utility
//             });
//           }
//           console.log(dataPoints);
//           resolve(dataPoints);
//         }
//       )
//     });
//   }


//   getProcessingTimePerUser(demoId: string, users: USUser[]): Promise<DataPoint[]> {
//     return new Promise((resolve, reject) => {
//       this.collection$.pipe(
//         filter(d => !!d && d.length > 0),
//         map(data => data.filter(d => users.some(u => u._id == d.user._id))),
//         take(1)
//       ).subscribe(data => {
//           let dataPoints = [];
//           for (const entry of data) {
//             const steps: IterationStep[] | undefined = entry.demosData.find((e) => e.demo === demoId)?.iterationSteps;
//             if (!steps) {
//               const displayId = shortID(entry.user);
//               dataPoints.push({
//                 name: displayId,
//                 value: 0
//               });
//               continue;
//             }

//             const startCreated = steps[0].createdAt ? steps[0].createdAt : 0
//             const startDate = new Date(startCreated);
//             const endCreated: Date | undefined = steps[steps.length - 1]?.createdAt
//             const endDate = new Date(endCreated ? endCreated : 0);
//             const diff = endDate.getTime() - startDate.getTime();

//             const displayId = shortID(entry.user);
//             dataPoints.push({
//               name: displayId,
//               value: diff / 1000 / 60,
//             });
//           }
//           resolve(dataPoints);
//         }
//       )
//     });
//   }

//   getProcessingTimeLogPerUser(demoId: string, users: USUser[]): Promise<DataPoint[]> {
//     return new Promise((resolve, reject) => {
//       this.collection$.pipe(
//         filter(d => !!d && d.length > 0),
//         map(data => data.filter(d => users.some(u => u._id == d.user._id))),
//         take(1)
//       ).subscribe(data => {
//           let dataPoints = [];
//           for (const entry of data) {
//             if(!entry.timeLog){
//               const displayId = shortID(entry.user);
//               dataPoints.push({
//                 name: displayId,
//                 value: 0
//               });
//               continue;
//             }
//             const logData: LogEntry[] = JSON.parse(entry.timeLog);

//             console.log(logData);
//             let demoStartEntry = logData.filter(
//               e => e.event === LogEvent.START_DEMO && e.info.demoId == demoId
//             )[0];
//             let demoFinishedeEntry = logData.filter(
//               e => e.event === LogEvent.END_DEMO && e.info.demoId == demoId
//             )[0];
//             if (!demoStartEntry || !demoFinishedeEntry) {
//               continue;
//             }
//             const startDate = new Date(demoStartEntry.timeStamp);
//             const endDate = new Date(demoFinishedeEntry.timeStamp);
//             const timeDiff = endDate.getTime() - startDate.getTime();

//             const displayId = shortID(entry.user);
//             dataPoints.push({
//               name: displayId,
//               value: timeDiff / 1000 / 60,
//             });
//           }
//           resolve(dataPoints);
//         }
//       )
//     });
//   }

// }
