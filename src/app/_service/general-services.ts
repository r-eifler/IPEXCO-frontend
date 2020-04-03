import {SelectedObjectService} from './selected-object.service';
import {PddlFilesService} from './pddl-files.service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PlanPropertyCollectionStore, ProjectStore} from '../store/stores.store';
import {ObjectCollectionService} from './object-collection.service';
import {PlanProperty} from '../_interface/plan-property';
import {Project} from '../_interface/project';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanPropertyCollectionService extends ObjectCollectionService<PlanProperty> {

  constructor(http: HttpClient, store: PlanPropertyCollectionStore) {
    super(http, store);
    this.BASE_URL = environment.apiURL + 'plan-property/';
  }
}


@Injectable({
  providedIn: 'root'
})
export class ProjectService extends ObjectCollectionService<Project> {

  constructor(http: HttpClient, store: ProjectStore) {
    super(http, store);
    this.BASE_URL = environment.apiURL + 'project/';
  }
}
