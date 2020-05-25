import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {PDDLFile} from '../interface/files';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {IHTTPData} from '../interface/http-data.interface';
import {Goal, GoalType} from '../interface/goal';
import {map} from 'rxjs/operators';
import { DomainSpecification } from '../interface/domain-specification';
import { DomainSpecificationService } from './domain-specification.service';

interface FileContent {
  data: string;
}

const BASE_URL = environment.apiURL + 'pddl-file/';

@Injectable({
  providedIn: 'root'
})
export class PddlFileUtilsService {

  domainSpec: DomainSpecification;

  constructor(
    private http: HttpClient,
    private domainSpecService: DomainSpecificationService) {
      domainSpecService.getSpec().subscribe(spec => this.domainSpec = spec);
    }

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
    return this.http.get<IHTTPData<string[]>>(`${BASE_URL}/${file._id}/goal-facts`).pipe(map(
      (value) => {
        const goalFacts: Goal[] = [];
        for (const g of value.data) {
          const goal: Goal = {name: g, goalType: GoalType.goalFact};
          this.domainSpec?.getGoalDescription(goal);
          goalFacts.push(goal);
        }
        return goalFacts;
      }
    ));
  }
}
