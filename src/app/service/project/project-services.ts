import {SelectedObjectService} from '../base/selected-object.service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CurrentProjectStore, ProjectsStore} from '../../store/stores.store';
import {ObjectCollectionService} from '../base/object-collection.service';
import {Project} from '../../interface/project';
import {environment} from '../../../environments/environment';
import {LOAD} from '../../store/generic-list.store';
import {ExecutionSettingsService} from '../settings/execution-settings.service';
import {DomainSpecificationService} from '../files/domain-specification.service';
import {TaskSchemaService} from '../task-info/schema.service';


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
    private settingsService: ExecutionSettingsService,
    private DomainSpecService: DomainSpecificationService,
    private taskSchemaService: TaskSchemaService) {
    super(store);
  }

  saveObject(project: Project) {
    this.selectedObjectStore.dispatch({type: LOAD, data: project});
    this.settingsService.load(project.settings);
    this.DomainSpecService.findSpec(project);
    this.taskSchemaService.findSchema(project);
  }
}
