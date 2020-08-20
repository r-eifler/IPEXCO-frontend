import { Injectable } from '@angular/core';
import {IHTTPData} from '../../interface/http-data.interface';
import {Demo} from '../../interface/demo';
import {EDIT} from '../../store/generic-list.store';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';


interface LogEntry {
  id: number;
  componentName: string;
  start: Date;
  end?: Date;
  info: string[];
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
    console.log(newEntry);
    return nextID;
  }

  addInfo(id, message): void {
    const entry = this.log.get(id);
    if (entry) {
      entry.info.push(message);
      console.log('INFO: ' + message);
    }
  }

  deregister(id): void {
    const entry = this.log.get(id);
    if (entry) {
      entry.end = new Date();
    }
    console.log('Deregister: ' + id);
  }

  store(): void {
    console.log(this.log);
    this.http.put<IHTTPData<Demo>>(this.BASE_URL, this.log)
      .subscribe(httpData => {
        console.log('time log stored');
      });
  }
}
