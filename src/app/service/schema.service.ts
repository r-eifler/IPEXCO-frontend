import { IHTTPData } from './../interface/http-data.interface';
import { Project } from './../interface/project';

import { Injectable } from '@angular/core';
import { ItemStore, LOAD, REMOVE } from '../store/generic-item.store';
import { TaskSchema } from '../interface/schema';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CurrentSchemaStore } from '../store/stores.store';

@Injectable({
  providedIn: 'root'
})
export class SchemaService {

  selectedObjectStore: ItemStore<TaskSchema>;

  constructor(private http: HttpClient, selectedObjectStore: CurrentSchemaStore) {
    this.selectedObjectStore = selectedObjectStore;
    this.currentSchema$ = selectedObjectStore.item$;
  }

  currentSchema$: BehaviorSubject<TaskSchema>;

  findSchema(project: Project): Observable<TaskSchema> {
    this.http.get<TaskSchema>(project.taskSchema).subscribe((res: TaskSchema) => {
        this.selectedObjectStore.dispatch({type: LOAD, data: res});
      });
    return this.currentSchema$;
  }

  getSchema(): Observable<TaskSchema> {
    return this.currentSchema$;
  }

  saveSchema(domainFile: TaskSchema) {
    this.selectedObjectStore.dispatch({type: LOAD, data: domainFile});
  }

  deleteSchema(domainFile: TaskSchema) {
    this.selectedObjectStore.dispatch({type: REMOVE, data: domainFile});
  }
}
