import {SelectedObjectService} from './selected-object.service';
import {PddlFilesService} from './pddl-files.service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CurrentProjectStore, PlanPropertyCollectionStore, ProjectsStore, RunsStore} from '../store/stores.store';
import {ObjectCollectionService} from './object-collection.service';
import {PlanProperty} from '../_interface/plan-property';
import {Project} from '../_interface/project';
import {environment} from '../../environments/environment';
import {IterPlanningStep} from '../_interface/iter-planning-step';
import {IterPlanningStepStore} from '../store/stores.store';

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
export class IterPlanningStepService extends ObjectCollectionService<IterPlanningStep> {

  constructor(http: HttpClient, store: IterPlanningStepStore) {
    super(http, store);
    this.BASE_URL = environment.apiURL + 'iter-planning-step/';
  }
}
