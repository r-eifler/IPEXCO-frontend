import {enableProdMode, Injectable} from '@angular/core';
import {SelectedObjectService} from '../base/selected-object.service';
import {ExplanationRun, RunStatus} from '../../interface/run';
import {CurrentQuestionStore} from '../../store/stores.store';
import {PlanPropertyMapService} from '../plan-properties/plan-property-services';
import {LOAD} from '../../store/generic-list.store';
import {updateMUGSPropsNames} from './utils';

@Injectable({
    providedIn: 'root'
})
export class SelectedQuestionService extends SelectedObjectService<ExplanationRun> {

    constructor(
        store: CurrentQuestionStore,
        protected planPropertiesService: PlanPropertyMapService
    ) {
        super(store);
    }

    saveObject(expRun: ExplanationRun) {
      if (! expRun.mugs && expRun.status === RunStatus.finished) {
        const result = JSON.parse(expRun.result);
        expRun.mugs = updateMUGSPropsNames(result.MUGS, this.planPropertiesService.getMap().value);
      }
      this.selectedObjectStore.dispatch({type: LOAD, data: expRun});
    }
}
