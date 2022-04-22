import { DemoIterationStepsService } from './demo-iteration-steps.service';
import { factEquals } from 'src/app/interface/plannig-task';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {RunningDemoService} from '../demo/demo-services';
import {DepExplanationRun, isStepSolvable, IterationStep, PlanRun, RunStatus, StepStatus} from '../../interface/run';
import {Demo} from '../../interface/demo';
import {PlannerService} from './planner.service';
import { SelectedIterationStepService } from './selected-iteration-step.service';


@Injectable({
    providedIn: 'root'
})
export class DemoPlannerService extends PlannerService {

    constructor(
        http: HttpClient,
        selectedStepService: SelectedIterationStepService,
        iterationStepsService: DemoIterationStepsService) {

        super(http, selectedStepService, iterationStepsService);
        this.BASE_URL = environment.apiURL + 'planner/';
    }

    myBaseURL = environment.apiURL + 'planner/';

    computePlan(step: IterationStep, save = false): void {
      super.computePlan(step, save);
    }

    computeMUGS(step: IterationStep, save = false): DepExplanationRun {
      // TODO

      return null;
    }



    computeMUGSfromQuestion(step: IterationStep, question: string[], save = false): DepExplanationRun {

      // TODO

      return null;

    }

    computeRelaxExplanations(step: IterationStep, demo: Demo = null): boolean {
      console.log("Demo computeRelaxExplanations")
      if (! demo){
        return false;
      }
      let initUpdates = step.task.initUpdates;
      let expRuns = demo.explanations.filter(
        expRun => expRun.initUpdates.every(up1 => initUpdates.some(
          up2 => factEquals(up1.orgFact, up2.orgFact) && factEquals(up1.newFact, up2.newFact))));
      if (expRuns.length == 1){
        step.relaxationExplanations = expRuns[0].relaxationExplanations;
        console.log(step.relaxationExplanations[0].dependencies)
        let solvable = isStepSolvable(step)
        step.status = solvable ? StepStatus.solvable : StepStatus.unsolvable;
        this.iterationStepsService.saveObject(step);
        this.selectedStepService.updateIfSame(step);
        return solvable;
      }
      else{
        console.error("No matching explanation");
        return false;
      }
    }

}


