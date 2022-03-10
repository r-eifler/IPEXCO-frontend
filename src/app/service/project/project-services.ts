import { ExecutionSettings } from 'src/app/interface/settings/execution-settings';
import {SelectedObjectService} from '../base/selected-object.service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CurrentProjectStore, ProjectsStore} from '../../store/stores.store';
import {ObjectCollectionService} from '../base/object-collection.service';
import {Project} from '../../interface/project';
import {environment} from '../../../environments/environment';
import {LOAD} from '../../store/generic-list.store';
import {DomainSpecificationService} from '../files/domain-specification.service';
import { PlanningTask } from 'src/app/interface/plannig-task';


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
  constructor(
    store: CurrentProjectStore,
    private DomainSpecService: DomainSpecificationService) {
    super(store);
  }

  saveObject(project: Project) {
    console.log(project);
    if (project) {
      project.baseTask = PlanningTask.fromJSON(project.baseTask, project.name + " Task", project.domainFile.domain);
      console.log(project.settings);
      // let jsonO = JSON.parse(project.settings) as ExecutionSettings;
      // console.log(jsonO);
      project.settings = JSON.parse(JSON.stringify(project.settings)) as ExecutionSettings;
      console.log(project.settings);
    }
    this.selectedObjectStore.dispatch({type: LOAD, data: project});
    if (project) {
      this.DomainSpecService.findSpec(project);
    }
  }
}
