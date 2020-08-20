import {Injectable} from '@angular/core';
import {SelectedObjectService} from '../base/selected-object.service';
import {ExplanationRun} from '../../interface/run';
import {CurrentQuestionStore} from '../../store/stores.store';
import {PlanPropertyMapService} from '../plan-properties/plan-property-services';
import {LOAD} from '../../store/generic-list.store';

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

    saveObject(questionRun: ExplanationRun) {
      this.selectedObjectStore.dispatch({type: LOAD, data: questionRun});
    }
}
