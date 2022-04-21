import { DemoIterationStepsService } from './demo-iteration-steps.service';
import { factEquals } from 'src/app/interface/plannig-task';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {RunningDemoService} from '../demo/demo-services';
import {DepExplanationRun, IterationStep, PlanRun, RunStatus} from '../../interface/run';
import {Demo} from '../../interface/demo';
import {PlannerService} from './planner.service';
import { SelectedIterationStepService } from './selected-iteration-step.service';


@Injectable({
    providedIn: 'root'
})
export class DemoPlannerService extends PlannerService {

    $demo: Observable<Demo>;

    constructor(
        http: HttpClient,
        selectedStepService: SelectedIterationStepService,
        iterationStepsService: DemoIterationStepsService,
        private demoService: RunningDemoService) {

        super(http, selectedStepService, iterationStepsService);
        this.BASE_URL = environment.apiURL + 'planner/';

        this.$demo = this.demoService.getSelectedObject();
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

    computeRelaxExplanations(step: IterationStep) {
      console.log("Demo computeRelaxExplanations")
      this.$demo.pipe(take(1)).subscribe(
        demo =>{
          let initUpdates = step.task.initUpdates;
          let expRuns = demo.explanations.filter(
            expRun => expRun.initUpdates.every(up1 => initUpdates.some(
              up2 => factEquals(up1.orgFact, up2.orgFact) && factEquals(up1.newFact, up2.newFact))));
          if (expRuns.length == 1){
            step.relaxationExplanations = expRuns[0].relaxationExplanations;
            console.log(step.relaxationExplanations[0].dependencies)
            this.iterationStepsService.saveObject(step);
            this.selectedStepService.updateIfSame(step);
          }
          else{
            console.error("No matching explanation");
          }
      });

    }

}


