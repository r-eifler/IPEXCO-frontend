import { IterationStep } from './../../interface/run';
import { CurrentProjectService } from 'src/app/service/project/project-services';
import {Injectable} from '@angular/core';
import {SelectedObjectService} from '../base/selected-object.service';
import {CurrentIterationStepStore, CurrentRunStore} from '../../store/stores.store';
import {PddlFileUtilsService} from '../files/pddl-file-utils.service';
import {PlanPropertyMapService} from '../plan-properties/plan-property-services';
import {combineLatest} from 'rxjs/internal/observable/combineLatest';
import {LOAD} from '../../store/generic-list.store';
import {handlePlanString} from './utils';

@Injectable({
    providedIn: 'root'
})
export class SelectedIterationStepService extends SelectedObjectService<IterationStep> {

    constructor(
        store: CurrentIterationStepStore,
        private fileUtilsService: PddlFileUtilsService,
        private currentProjectService: CurrentProjectService,
        private planPropertyMapService: PlanPropertyMapService) {
        super(store);
    }

    // saveObject(iterStep: IterationStep) {
    //   if (iterStep === null || iterStep === undefined) {
    //     this.selectedObjectStore.dispatch({type: LOAD, data: iterStep});
    //     return;
    //   }
    //   if (iterStep.planString && !iterStep.plan) {
    //       combineLatest([this.currentProjectService.findSelectedObject(), this.planPropertyMapService.getMap()]).subscribe(
    //           ([project, planProperties]) => {
    //               if (project && planProperties) {
    //                   iterStep.planValue = computePlanValue(iterStep, planProperties);
    //                   handlePlanString(iterStep.planString, iterStep, project.baseTask);
    //                   this.selectedObjectStore.dispatch({type: LOAD, data: iterStep});
    //               }
    //           });


    //   } else if (iterStep.planPath && !iterStep.plan) {
    //       const planContent$ = this.fileUtilsService.getFileContent(iterStep.planPath);
    //       // console.log('Loade Plan');
    //       combineLatest([this.currentProjectService.findSelectedObject(), planContent$, this.planPropertyMapService.getMap()]).subscribe(
    //           ([project, content, planProperties]) => {
    //               // console.log(content);
    //               if (content && planProperties) {
    //                   iterStep.planValue = computePlanValue(iterStep, planProperties);
    //                   handlePlanString(content, iterStep, project.baseTask);
    //                   this.selectedObjectStore.dispatch({type: LOAD, data: iterStep});
    //               }
    //           });
    //   } else {
    //       this.selectedObjectStore.dispatch({type: LOAD, data: iterStep});
    //   }
    // }
}
