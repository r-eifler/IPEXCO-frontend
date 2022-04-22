import { IterationStepsService } from 'src/app/service/planner-runs/iteration-steps.service';
import {Injectable} from '@angular/core';
import {DemoPlannerService} from './demo-planner.service';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {IterationStepsStore} from '../../store/stores.store';
import {DepExplanationRun, IterationStep, PlanRun} from '../../interface/run';
import { SelectedIterationStepService } from './selected-iteration-step.service';
import { PlanProperty } from 'src/app/interface/plan-property/plan-property';
import { RunningDemoService } from '../demo/demo-services';
import { DemoIterationStepsService } from './demo-iteration-steps.service';


@Injectable({
    providedIn: 'root'
})
export class UserStudyPlannerService extends DemoPlannerService {

    myBaseURL = environment.apiURL + 'planner/';

    constructor(
        http: HttpClient,
        selectedStepService: SelectedIterationStepService,
        iterationStepsService: DemoIterationStepsService) {
        super(http, selectedStepService, iterationStepsService);
        this.BASE_URL = environment.apiURL + 'planner/';
    }

    computePlan(step: IterationStep): void {
        super.computePlan(step, true);
    }

}
