import {SelectedObjectService} from './selected-object.service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CurrentProjectStore, ProjectsStore} from '../store/stores.store';
import {ObjectCollectionService} from './object-collection.service';
import {Project} from '../interface/project';
import {environment} from '../../environments/environment';
import {LOAD} from '../store/generic-list.store';
import {ExecutionSettingsService} from './execution-settings.service';


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
    private settingsService: ExecutionSettingsService,) {
    super(store);
  }

  saveObject(project: Project) {
    this.selectedObjectStore.dispatch({type: LOAD, data: project});
    this.settingsService.load(project.settings);
  }
}
