import {SelectedObjectService} from './selected-object.service';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CurrentProjectStore, RunsStore, CurrentRunStore, PlanPropertyCollectionStore, ProjectsStore} from '../store/stores.store';
import {ObjectCollectionService} from './object-collection.service';
import {PlanProperty} from '../_interface/plan-property';
import {Project} from '../_interface/project';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {GoalType} from '../_interface/goal';
import {IHTTPData} from '../_interface/http-data.interface';
import {LOAD} from '../store/generic-list.store';
import {PlanRun} from '../_interface/run';

@Injectable({
  providedIn: 'root'
})
export class PlanPropertyCollectionService extends ObjectCollectionService<PlanProperty> {

  constructor(http: HttpClient, store: PlanPropertyCollectionStore) {
    super(http, store);
    this.BASE_URL = environment.apiURL + 'plan-property/';
    this.pipeGet = map((value: PlanProperty): PlanProperty => {value.goalType = GoalType.planProperty; return value; });
    this.pipeFind =  map((value: PlanProperty[]): PlanProperty[] =>  {
      for (const p of value) {
        p.goalType = GoalType.planProperty;
      }
      return value;
    });
  }
}


@Injectable({
  providedIn: 'root'
})
export class ProjectsService extends ObjectCollectionService<Project> {

  constructor(http: HttpClient, store: ProjectsStore) {
    super(http, store);
    this.BASE_URL = environment.apiURL + 'project/';
  }
}

@Injectable({
  providedIn: 'root'
})
export class CurrentProjectService extends SelectedObjectService<Project> {

  constructor(store: CurrentProjectStore) {
    super(store);
  }
}

@Injectable({
  providedIn: 'root'
})
export class RunService extends ObjectCollectionService<PlanRun> {

  constructor(http: HttpClient, store: RunsStore) {
    super(http, store);
    this.BASE_URL = environment.apiURL + 'run/';
  }
}
@Injectable({
  providedIn: 'root'
})
export class CurrentRunService extends SelectedObjectService<PlanRun> {

  constructor(store: CurrentRunStore) {
    super(store);
  }
}

