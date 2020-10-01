import { Injectable } from '@angular/core';
import {IHTTPData} from '../../interface/http-data.interface';
import {Demo} from '../../interface/demo';
import {EDIT} from '../../store/generic-list.store';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';


export interface LogEntry {
  id: number;
  componentName: string;
  start: Date;
  end?: Date;
  info: {timeStamp: Date, message: string}[];
}


@Injectable({
  providedIn: 'root'
})
export class TimeLoggerService {

  private BASE_URL: string;
  private id = 0;
  private log = new Map<number, LogEntry>();

  constructor(private http: HttpClient) {
    this.BASE_URL = environment.apiURL + 'user-study-users/timelog';
  }

  register(name): number {
    const nextID = this.id++;
    const newEntry = {id: nextID, componentName: name, start: new Date(), info: []};
    this.log.set(nextID, newEntry);
    // console.log(newEntry);
    return nextID;
  }

  addInfo(id, message: string): void {
    const entry = this.log.get(id);
    if (entry) {
      entry.info.push({timeStamp: new Date(), message});
      // console.log('INFO: ' + message);
    }  else {
      throw new Error('Undefined logger id');
    }
  }

  deregister(id): void {
    const entry = this.log.get(id);
    if (entry) {
      entry.end = new Date();
    }
    // console.log('Deregister: ' + id);
  }

  store(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const timeLog = JSON.stringify(Array.from(this.log.values()));
      this.http.post<IHTTPData<Demo>>(this.BASE_URL, {timeLog})
        .subscribe(httpData => {
          // console.log('time log stored');
          return resolve();
        });
    });
  }

  reset(): void {
    // console.log(this.log);
    this.id = 0;
    this.log = new Map<number, LogEntry>();
  }
}
