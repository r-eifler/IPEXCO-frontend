import { CurrentProjectService } from "src/app/service/project/project-services";
import { Injectable } from "@angular/core";
import { SelectedObjectService } from "../base/selected-object.service";
import { PlanRun } from "../../interface/run";
import { CurrentRunStore } from "../../store/stores.store";
import { PddlFileUtilsService } from "../files/pddl-file-utils.service";
import { PlanPropertyMapService } from "../plan-properties/plan-property-services";
import { combineLatest } from "rxjs/internal/observable/combineLatest";
import { LOAD } from "../../store/generic-list.store";

@Injectable({
  providedIn: "root",
})
export class SelectedPlanRunService extends SelectedObjectService<PlanRun> {
  constructor(
    store: CurrentRunStore,
    private fileUtilsService: PddlFileUtilsService,
    private currentProjectService: CurrentProjectService,
    private planPropertyMapService: PlanPropertyMapService
  ) {
    super(store);
  }

  //TODO
  // saveObject(planRun: PlanRun) {
  //   if (planRun === null || planRun === undefined) {
  //     this.selectedObjectStore.dispatch({type: LOAD, data: planRun});
  //     return;
  //   }
  //   if (planRun.planString && !planRun.plan) {
  //       combineLatest([this.currentProjectService.findSelectedObject(), this.planPropertyMapService.getMap()]).subscribe(
  //           ([project, planProperties]) => {
  //               if (project && planProperties) {
  //                   planRun.planValue = computePlanValue(planRun, planProperties);
  //                   handlePlanString(planRun.planString, planRun, project.baseTask);
  //                   this.selectedObjectStore.dispatch({type: LOAD, data: planRun});
  //               }
  //           });

  //   } else if (planRun.planPath && !planRun.plan) {
  //       const planContent$ = this.fileUtilsService.getFileContent(planRun.planPath);
  //       // console.log('Loade Plan');
  //       combineLatest([this.currentProjectService.findSelectedObject(), planContent$, this.planPropertyMapService.getMap()]).subscribe(
  //           ([project, content, planProperties]) => {
  //               // console.log(content);
  //               if (content && planProperties) {
  //                   planRun.planValue = computePlanValue(planRun, planProperties);
  //                   handlePlanString(content, planRun, project.baseTask);
  //                   this.selectedObjectStore.dispatch({type: LOAD, data: planRun});
  //               }
  //           });
  //   } else {
  //       this.selectedObjectStore.dispatch({type: LOAD, data: planRun});
  //   }
  // }
}
