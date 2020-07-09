import {Injectable} from '@angular/core';
import {SelectedObjectService} from '../base/selected-object.service';
import {ExplanationRun} from '../../interface/run';
import {CurrentQuestionStore} from '../../store/stores.store';
import {PddlFileUtilsService} from '../files/pddl-file-utils.service';
import {PlanPropertyMapService} from '../plan-properties/plan-property-services';
import {LOAD} from '../../store/generic-list.store';

@Injectable({
    providedIn: 'root'
})
export class SelectedQuestionService extends SelectedObjectService<ExplanationRun> {

    constructor(
        store: CurrentQuestionStore,
        protected fileUtilsService: PddlFileUtilsService,
        protected planPropertiesService: PlanPropertyMapService
    ) {
        super(store);
    }

    saveObject(questionRun: ExplanationRun) {
        if (!questionRun.mugs) {
            console.log('Question service get MUGS');
            questionRun.mugs = [];
            const answer = JSON.parse(questionRun.result);
            for (const mugs of answer.MUGS) {
                const list = [];
                for (const elem of mugs) {
                    list.push(elem.replace('sat_', '').replace('soft_accepting(', '').replace(')', ''));
                }
                questionRun.mugs.push(list);
            }
            this.selectedObjectStore.dispatch({type: LOAD, data: questionRun});
            // combineLatest([this.fileUtilsService.getFileContent(questionRun.result), this.planPropertiesService.getList()]).subscribe(
            //   ([content, planProperties]) => {
            //   questionRun.mugs = [];
            //   const answer = JSON.parse(content);
            //   for (const mugs of answer.MUGS) {
            //     const list = [];
            //     for (const elem of mugs) {
            //         const pp = planProperties.find(p => p.name === elem.replace('sat_', ''));
            //         list.push(pp.naturalLanguageDescription);
            //     }
            //     questionRun.mugs.push(list);
            //   }
            //   this.selectedObjectStore.dispatch({type: LOAD, data: questionRun});
            // });
        } else {
            this.selectedObjectStore.dispatch({type: LOAD, data: questionRun});
        }
    }
}
