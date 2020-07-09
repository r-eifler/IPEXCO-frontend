import {Injectable} from '@angular/core';
import {DemoPlannerService} from './demoPlanner.service';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {RunsStore} from '../../store/stores.store';
import {RunningDemoService} from '../demo/demo-services';
import {PlanPropertyMapService} from '../plan-properties/plan-property-services';
import {ExplanationRun, PlanRun} from '../../interface/run';

@Injectable({
    providedIn: 'root'
})
export class UserStudyPlannerService extends DemoPlannerService {

    myBaseURL = environment.apiURL + 'planner/';

    constructor(
        http: HttpClient,
        store: RunsStore,
        runningDemoService: RunningDemoService,
        planPropertiesService: PlanPropertyMapService) {
        super(http, store, runningDemoService, planPropertiesService);
        this.BASE_URL = environment.apiURL + 'planner/';
    }

    execute_plan_run(run: PlanRun): void {
        super.execute_plan_run(run, true);
    }


    execute_mugs_run(planRun: PlanRun, expRun: ExplanationRun): void {
        super.execute_mugs_run(planRun, expRun, true);
    }

}
