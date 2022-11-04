import { ExecutionSettingsServiceService } from './../settings/ExecutionSettingsService.service';
import { ExecutionSettings } from "src/app/interface/settings/execution-settings";
import { SelectedObjectService } from "../base/selected-object.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CurrentProjectStore, ProjectsStore } from "../../store/stores.store";
import { ObjectCollectionService } from "../base/object-collection.service";
import { Project } from "../../interface/project";
import { environment } from "../../../environments/environment";
import { LOAD } from "../../store/generic-list.store";
import { DomainSpecificationService } from "../files/domain-specification.service";
import { PlanningTask } from "src/app/interface/plannig-task";
import { ItemStore } from 'src/app/store/generic-item.store';

@Injectable({
  providedIn: "root",
})
export class ProjectsService extends ObjectCollectionService<Project> {
  constructor(http: HttpClient, store: ProjectsStore) {
    super(http, store);
    this.BASE_URL = environment.apiURL + "project/";
  }
}

@Injectable({
  providedIn: "root",
})
export class BaseProjectService<T> extends SelectedObjectService<T> {
  constructor(
    selectedObjectStore: ItemStore<T>,
    protected settingsService: ExecutionSettingsServiceService,
    protected domainSpecService: DomainSpecificationService) {
    super(selectedObjectStore);
  }

}

@Injectable({
  providedIn: "root",
})
export class CurrentProjectService extends BaseProjectService<Project> {
  constructor(
    store: CurrentProjectStore,
    settingsService: ExecutionSettingsServiceService,
    domainSpecService: DomainSpecificationService) {
    super(store, settingsService, domainSpecService);
  }

  saveObject(project: Project) {
    // if (project) {
    //   project.settings = JSON.parse(project.settings.toString()) as ExecutionSettings;
    //   console.log(project);
    // }
    console.log("Service store project, its settings and the deomain specification");
    this.settingsService.saveObject(project.settings);
    this.domainSpecService.findSpec(project);

    this.selectedObjectStore.dispatch({ type: LOAD, data: project });
  }
}
