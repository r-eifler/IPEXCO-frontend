import {Project} from '../../interface/project';

import {Injectable} from '@angular/core';
import {ItemStore, LOAD} from '../../store/generic-item.store';
import {TaskSchema} from '../../interface/task-schema';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {TaskSchemaStore} from '../../store/stores.store';

@Injectable({
  providedIn: 'root'
})
export class TaskSchemaService {

  private selectedObjectStore: ItemStore<TaskSchema>;

  constructor(private http: HttpClient, selectedObjectStore: TaskSchemaStore) {
    this.selectedObjectStore = selectedObjectStore;
    this.currentSchema$ = selectedObjectStore.item$;
  }

  private currentSchema$: BehaviorSubject<TaskSchema>;

  findSchema(project: Project): Observable<TaskSchema> {
    this.http.get<TaskSchema>(project.taskSchema).subscribe((json) => {
        const taskSchema: TaskSchema = new TaskSchema(json);
        // console.log(taskSchema);
        this.selectedObjectStore.dispatch({type: LOAD, data: taskSchema});
      });
    return this.currentSchema$;
  }

  getSchema(): Observable<TaskSchema> {
    return this.currentSchema$;
  }

}
