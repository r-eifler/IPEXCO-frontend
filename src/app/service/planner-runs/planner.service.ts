import { IterationStepsService } from "src/app/service/planner-runs/iteration-steps.service";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { IHTTPData } from "../../interface/http-data.interface";
import { BehaviorSubject } from "rxjs";
import { IterationStep } from "src/app/iterative_planning/domain/iteration_step";
import { PlanRun, RunStatus } from "src/app/iterative_planning/domain/run";
@Injectable({
  providedIn: "root",
})
export class PlannerService {
  BASE_URL: string;
  myBaseURL = environment.apiURL + "planner/";

  // Indicates if the Planner is currently busy and it is possible to request an other plan.
  plannerBusy = new BehaviorSubject(false);

  constructor(
    protected http: HttpClient,
    protected iterationStepsService: IterationStepsService
  ) {
    this.BASE_URL = environment.apiURL + "planner/";
  }

  isPlannerBusy(): BehaviorSubject<boolean> {
    return this.plannerBusy;
  }

  computePlan(step: IterationStep, save = true): void {
    this.plannerBusy.next(true);

    console.log("compute plan");
    let httpParams = new HttpParams();
    httpParams = httpParams.set("save", String(save));

    const planRun: PlanRun = { name: "Plan ", status: RunStatus.pending };
    // step.plan = planRun;
    // this.selectedStepService.saveObject(step);

    this.BASE_URL = this.myBaseURL + "plan";
    this.http
      .post<IHTTPData<IterationStep>>(
        this.BASE_URL,
        { data: step },
        { params: httpParams }
      )
      .subscribe((httpData) => {
        let stepBack = httpData.data;
        stepBack._id = step._id;
        console.log("Plan Computed");
        console.log(step);
        this.iterationStepsService.saveObject(stepBack);
        // this.selectedStepService.updateIfSame(stepBack);
        this.plannerBusy.next(false);
      });
  }

  // computeMUGSfromQuestion(
  //   step: IterationStep,
  //   question: string[]
  // ): DepExplanationRun {
  //   this.plannerBusy.next(true);
  //   const url = this.myBaseURL + "mugs/" + step._id;

  //   let softGoals: string[] = step.hardGoals.filter(
  //     (pp) => !question.some((h) => h == pp)
  //   );

  //   let expRun: DepExplanationRun = {
  //     name: "DExpQ",
  //     status: RunStatus.pending,
  //     hardGoals: question,
  //     softGoals,
  //   };

  //   this.http
  //     .post<IHTTPData<IterationStep>>(url, expRun)
  //     .subscribe((httpData) => {
  //       let step = httpData.data;
  //       this.iterationStepsService.saveObject(step);
  //       this.selectedStepService.updateIfSame(step);
  //       this.plannerBusy.next(false);
  //     });

  //   return expRun;
  // }

  // computeMUGS(step: IterationStep): DepExplanationRun {
  //   this.plannerBusy.next(true);
  //   const url = this.myBaseURL + "mugs/" + step._id;

  //   let expRun: DepExplanationRun = {
  //     name: "DExp",
  //     status: RunStatus.pending,
  //     hardGoals: [],
  //     softGoals: [...step.hardGoals, ...step.softGoals],
  //   };
  //   console.log(expRun);

  //   this.http
  //     .post<IHTTPData<IterationStep>>(url, expRun)
  //     .subscribe((httpData) => {
  //       let step = httpData.data;
  //       this.iterationStepsService.saveObject(step);
  //       this.selectedStepService.updateIfSame(step);
  //       this.plannerBusy.next(false);
  //     });

  //   return expRun;
  // }

}
