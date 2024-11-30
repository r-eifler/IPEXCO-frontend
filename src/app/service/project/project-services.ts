import { SelectedObjectService } from "../base/selected-object.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CurrentProjectStore, ProjectsStore } from "../../store/stores.store";
import { ObjectCollectionService } from "../base/object-collection.service";
import { environment } from "../../../environments/environment";
import { LOAD } from "../../store/generic-list.store";
import { ItemStore } from 'src/app/store/generic-item.store';
import { PlanPropertyMapService } from "../plan-properties/plan-property-services";
import { IterationStepsService } from "../planner-runs/iteration-steps.service";
import { Project } from "src/app/project/domain/project";

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
  constructor(
      store: CurrentProjectStore,
      protected propertiesService: PlanPropertyMapService,
      protected runsService: IterationStepsService,
    ) {
    super(store);
  }

  saveObject(project: Project) {

    // TODO 
    project.baseTask = JSON.parse(project.baseTask as unknown as string)
    project.domainSpecification = JSON.parse(project.domainSpecification as unknown as string)


    this.selectedObjectStore.dispatch({ type: LOAD, data: project });

    console.log('current project:' + project._id)

    this.runsService.reset()
    this.runsService.findCollection([
      { param: "projectId", value: project._id },
    ]);
    this.propertiesService.findCollection([
      { param: "projectId", value: project._id },
    ]);

    // TODO demo service missing
  }

}
