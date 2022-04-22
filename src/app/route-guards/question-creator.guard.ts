import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanDeactivate,
  Router,
} from "@angular/router";

import { QuestionCreatorComponent } from "../components/iter-planning/question-step/question-creator/question-creator.component";
import { PlannerService } from "../service/planner-runs/planner.service";
import { SelectedPlanRunService } from "../service/planner-runs/selected-planrun.service";
import { SelectedQuestionService } from "../service/planner-runs/selected-question.service";
import { combineLatest } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class QuestionCreatorGuard
  implements CanDeactivate<QuestionCreatorComponent>
{
  constructor(
    private router: Router,
    private plannerService: PlannerService,
    private selectedPlanRunService: SelectedPlanRunService,
    private selectedQuestionService: SelectedQuestionService
  ) {}

  canDeactivate(
    component: QuestionCreatorComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): boolean | Promise<boolean | UrlTree> {
    if (nextState.url.includes("question-step")) {
      return true;
    }
    return this.checkQuestionComputed(currentState);
  }

  checkQuestionComputed(
    currentState: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    return new Promise<boolean | UrlTree>((resolve, reject) => {
      this.plannerService.isPlannerBusy().subscribe((busy) => {
        if (!busy) {
          combineLatest([
            this.selectedPlanRunService.getSelectedObject(),
            this.selectedQuestionService.getSelectedObject(),
          ]).subscribe(([planRun, expRun]) => {
            if (planRun && expRun) {
              const path =
                currentState.url.replace("new-question", "") +
                "question-step/" +
                expRun._id;
              resolve(this.router.parseUrl(path));
              return;
            }
            resolve(true);
            return;
          });
        }
      });
    });
  }
}
