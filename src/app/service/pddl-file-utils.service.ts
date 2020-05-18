import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {PDDLFile} from '../interface/files';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {IHTTPData} from '../interface/http-data.interface';
import {Goal, GoalType} from '../interface/goal';
import {map} from 'rxjs/operators';

interface FileContent {
  data: string;
}

const BASE_URL = environment.apiURL + 'pddl-file/';

@Injectable({
  providedIn: 'root'
})
export class PddlFileUtilsService {

  constructor(private http: HttpClient) { }

  getFileContent(path: string): Observable<string> {
    if (path !== undefined) {
      console.log('Get file Content: ' + path);
      return this.http.get(path, {responseType: 'text'});
    } else {
      throw Error('path for file content in undefined');
    }
  }

  getGoalFacts(file: PDDLFile): Observable<Goal[]> {
    console.log('get goal facts');
    // items$ = new BehaviorSubject<T[]>([]);
    return this.http.get<IHTTPData<string[]>>(`${BASE_URL}/${file._id}/goal-facts`).pipe(map(
      (value) => {
        const goalFacts: Goal[] = [];
        for (const g of value.data) {
          goalFacts.push({name: g, goalType: GoalType.goalFact});
        }
        return goalFacts;
      }
    ));
  }
}
