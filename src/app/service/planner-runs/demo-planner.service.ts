import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {RunsStore} from '../../store/stores.store';
import {RunningDemoService} from '../demo/demo-services';
import {DepExplanationRun, PlanRun} from '../../interface/run';
import {Demo} from '../../interface/demo';
import {ADD, EDIT} from '../../store/generic-list.store';
import {IHTTPData} from '../../interface/http-data.interface';
import {PlannerService} from './planner.service';
import {SelectedPlanRunService} from './selected-planrun.service';
import {SelectedQuestionService} from './selected-question.service';
import {DomainSpecification} from '../../interface/files/domain-specification';
import {GoalType, PlanProperty} from '../../interface/plan-property/plan-property';

@Injectable({
    providedIn: 'root'
})
export class DemoPlannerService extends PlannerService {

    constructor(
        http: HttpClient,
        store: RunsStore,
        private runningDemoService: RunningDemoService,
        private selectedPlanRunService: SelectedPlanRunService,
        private selectedQuestionService: SelectedQuestionService) {
        super(http, store);
        this.BASE_URL = environment.apiURL + 'planner/';
    }

    myBaseURL = environment.apiURL + 'planner/';

    private static findPlan(planPropertiesGoalFacts: string[], demo: Demo): {planProperties: string[], plan: string} {
      let foundPlanObj: {planProperties: string[], plan: string} = null;
      for (const planObj of demo.data.plans) {
        if (planObj.planProperties.length === planPropertiesGoalFacts.length) {
          for (const goalFact of planPropertiesGoalFacts) {
            if (planObj.planProperties.indexOf(goalFact) === -1) {
              break;
            }
            foundPlanObj = planObj;
          }
        }
        if (foundPlanObj) {
          break;
        }
      }
      return foundPlanObj;
    }


    private static filterMUGS(questionPlanProperties: string[], demo: Demo): string [][] {
      // console.log(questionPlanProperties);
      // console.log(demo.data.MUGS);
      const filteredMugs = [];
      for (const mugs of demo.data.MUGS) {
        for (const questionFact of questionPlanProperties) {
          if (mugs.indexOf(questionFact) > -1) {
            const mugsRest = [];
            for (const fact of mugs) {
              if (fact !== questionFact) {
                mugsRest.push(fact);
              }
            }
            filteredMugs.push(mugsRest);
            break;
          }
        }
      }
      return filteredMugs;
    }

    execute_plan_run(run: PlanRun, save = false): void {
      // TODO
      // const demo: Demo = this.runningDemoService.getSelectedObject().getValue();

      // if (!demo.data.plans || demo.data.plans.length === 0) {
      //     super.execute_plan_run(run, save);
      //     return;
      // }

      // this.plannerBusy.next(true);
      // const planPropertiesGoalFacts = run.hardGoals;
      // const foundPlanObj = DemoPlannerService.findPlan(planPropertiesGoalFacts, demo);

      // run.planPath = demo.definition + '/' + foundPlanObj.plan;

      // // get all properties which are satisfied by this plan
      // run.satPlanProperties = demo.data.satPropertiesPerPlan.filter(p => p.plan === foundPlanObj.plan)[0].planProperties;
      // this.listStore.dispatch({type: ADD, data: run});
      // this.plannerBusy.next(false);
    }

    execute_mugs_run(planRun: PlanRun, expRun: DepExplanationRun, save = false): void {

      // TODO
      // this.plannerBusy.next(true);
      // const demo: Demo = this.runningDemoService.getSelectedObject().getValue();

      // // question: goals which were no hard goals in the plan run
      // // if question is empty then the question is: Why unsolvable
      // const question = expRun.hardGoals; //.filter(hg => !planRun.hardGoals.some(c => hg === c));

      // if (question.length > 0) {
      //   expRun.mugs = DemoPlannerService.filterMUGS(question, demo);
      // } else {
      //   expRun.mugs = demo.data.MUGS;
      // }

      // // planRun.explanationRuns.push(expRun);
      // this.listStore.dispatch({type: EDIT, data: planRun});

      // this.selectedPlanRunService.saveObject(planRun);
      // this.selectedQuestionService.saveObject(expRun);
      // this.plannerBusy.next(false);

      // if (save) {
      //     this.save_mugs_run(planRun, expRun);
      // }

    }

    private save_mugs_run(planRun: PlanRun, expRun: DepExplanationRun): void {
        const url = this.myBaseURL + 'mugs-save/' + planRun._id;

        this.http.post<IHTTPData<PlanRun>>(url, expRun)
            .subscribe(httpData => {
                // console.log('Question saved on server.');
                // const action = {type: EDIT, data: httpData.data};
                // this.listStore.dispatch(action);
            });
    }

}
