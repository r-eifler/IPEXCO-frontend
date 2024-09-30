import { CurrentProjectService } from 'src/app/service/project/project-services';
import { GeneralSettings } from 'src/app/interface/settings/general-settings';
import { Component, Input, OnInit } from "@angular/core";
import { BehaviorSubject, Observable, combineLatest } from "rxjs";
import { filter, map } from "rxjs/operators";
import { getMaximalPlanValue, PlanProperty } from "src/app/iterative_planning/domain/plan-property/plan-property";
import { PlanPropertyMapService } from "src/app/service/plan-properties/plan-property-services";
import { computePlanValue, IterationStep, StepStatus } from 'src/app/iterative_planning/domain/run';

@Component({
  selector: "app-score-view",
  templateUrl: "./score-view.component.html",
  styleUrls: ["./score-view.component.scss"],
})
export class ScoreViewComponent implements OnInit {
  @Input()
  set step(step: IterationStep) {
    this.step$.next(step);
  }

  private step$ = new BehaviorSubject<IterationStep>(null);
  private planProperties$: BehaviorSubject<Map<string, PlanProperty>>;

  isSolvable$: Observable<boolean>;
  isUnSolvable$: Observable<boolean>;

  planValue$: Observable<number>;
  maxPlanValue$: Observable<number>;
  overallScore$: Observable<number>;

  settings$: Observable<GeneralSettings>;

  constructor(
    private planPropertiesMapService: PlanPropertyMapService,
    private selectedProjectService: CurrentProjectService
  ) {
    this.planProperties$ = planPropertiesMapService.getMap();

    this.isSolvable$ = this.step$.pipe(
      filter((step) => !!step),
      map((step) => step.status == StepStatus.solvable)
    );

    this.isUnSolvable$ = this.step$.pipe(
      filter((step) => !!step),
      map((step) => step.status == StepStatus.unsolvable)
    );

    this.planValue$ = combineLatest([this.step$, this.planProperties$]).pipe(
      map(([step, planProperties]) => {
        if (!!step && !!planProperties && planProperties.size > 0) {
          return computePlanValue(step, planProperties);
        } else {
          return 0;
        }
      })
    );

    this.maxPlanValue$ = this.planProperties$.pipe(
      map((planProperties) => {
        if (!!planProperties && planProperties.size > 0) {
          return getMaximalPlanValue(planProperties);
        } else {
          return 0;
        }
      })
    );

   
    this.overallScore$ = this.planValue$;

    this.settings$ = this.selectedProjectService.getSelectedObject().pipe(
      filter(p => !!p),
      map(p => p.settings)
    );
  }

  ngOnInit(): void {}
}
