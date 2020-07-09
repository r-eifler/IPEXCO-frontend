import {Injectable} from '@angular/core';
import {SelectedObjectService} from '../base/selected-object.service';
import {PlanRun} from '../../interface/run';
import {CurrentRunStore} from '../../store/stores.store';
import {PddlFileUtilsService} from '../files/pddl-file-utils.service';
import {TaskSchemaService} from '../task-info/schema.service';
import {PlanPropertyMapService} from '../plan-properties/plan-property-services';
import {combineLatest} from 'rxjs/internal/observable/combineLatest';
import {LOAD} from '../../store/generic-list.store';
import {computePlanValue, handlePlanString} from './utils';

@Injectable({
    providedIn: 'root'
})
export class SelectedPlanRunService extends SelectedObjectService<PlanRun> {

    constructor(
        store: CurrentRunStore,
        private fileUtilsService: PddlFileUtilsService,
        private taskSchemaService: TaskSchemaService,
        private planPropertyMapService: PlanPropertyMapService) {
        super(store);
    }

    saveObject(planRun: PlanRun) {
        console.log('Current run stored');
        if (planRun.planString && !planRun.plan) {
            combineLatest([this.taskSchemaService.getSchema(), this.planPropertyMapService.getMap()]).subscribe(
                ([schema, planProperties]) => {
                    if (schema) {
                        planRun.planValue = computePlanValue(planRun, planProperties);
                        console.log('PlanValue: ' + planRun.planValue);
                        handlePlanString(planRun.planString, planRun, schema);
                        this.selectedObjectStore.dispatch({type: LOAD, data: planRun});
                    }
                });


        } else if (planRun.planPath && !planRun.plan) {
            const planContent$ = this.fileUtilsService.getFileContent(planRun.planPath);
            // console.log('Loade Plan');
            combineLatest([this.taskSchemaService.getSchema(), planContent$, this.planPropertyMapService.getMap()]).subscribe(
                ([schema, content, planProperties]) => {
                    // console.log(content);
                    if (content) {
                        planRun.planValue = computePlanValue(planRun, planProperties);
                        handlePlanString(content, planRun, schema);
                        this.selectedObjectStore.dispatch({type: LOAD, data: planRun});
                    }
                });
        } else {
            this.selectedObjectStore.dispatch({type: LOAD, data: planRun});
        }
    }
}
