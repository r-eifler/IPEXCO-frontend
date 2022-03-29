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

    saveObject(obj: IterationStep) {
      console.log("Selected Step");
      console.log(obj);
      this.selectedObjectStore.dispatch({type: LOAD, data: obj});
    }
}
