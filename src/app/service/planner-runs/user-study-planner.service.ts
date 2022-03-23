import {Injectable} from '@angular/core';
import {DemoPlannerService} from './demo-planner.service';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {IterationStepsStore} from '../../store/stores.store';
import {DepExplanationRun, PlanRun} from '../../interface/run';
import { SelectedIterationStepService } from './selected-iteration-step.service';


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


    execute_mugs_run(planRun: PlanRun, expRun: DepExplanationRun): void {
        super.execute_mugs_run(planRun, expRun, true);
    }

}
