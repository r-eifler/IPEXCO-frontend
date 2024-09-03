import { SelectedObjectService } from "../base/selected-object.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CurrentProjectStore, ProjectsStore } from "../../store/stores.store";
import { ObjectCollectionService } from "../base/object-collection.service";
import { Project } from "../../interface/project";
import { environment } from "../../../environments/environment";
import { LOAD } from "../../store/generic-list.store";
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
  constructor(selectedObjectStore: ItemStore<T>) {
    super(selectedObjectStore);
  }

}

@Injectable({
  providedIn: "root",
})
export class CurrentProjectService extends BaseProjectService<Project> {
  constructor(store: CurrentProjectStore) {
    super(store);
  }

  saveObject(project: Project) {
    this.selectedObjectStore.dispatch({ type: LOAD, data: project });
  }

}
