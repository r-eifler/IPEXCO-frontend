import {Injectable} from '@angular/core';
import {DemoPlannerService} from './demo-planner.service';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {IterationStepsStore} from '../../store/stores.store';
import {DepExplanationRun, IterationStep, PlanRun} from '../../interface/run';
import { SelectedIterationStepService } from './selected-iteration-step.service';
import { PlanProperty } from 'src/app/interface/plan-property/plan-property';


@Injectable({
    providedIn: 'root'
})
export class UserStudyPlannerService extends DemoPlannerService {

    myBaseURL = environment.apiURL + 'planner/';

    constructor(
        http: HttpClient,
        selectedStepService: SelectedIterationStepService,
        iterationStepsStore: IterationStepsStore) {
        super(http, selectedStepService, iterationStepsStore);
        this.BASE_URL = environment.apiURL + 'planner/';
    }

    execute_plan_run(run: PlanRun): void {
        super.execute_plan_run(run, true);
    }


    computeMUGSfromQuestion(step: IterationStep, question: string[]): DepExplanationRun {
        return super.computeMUGSfromQuestion(step, question, true);
    }

}
