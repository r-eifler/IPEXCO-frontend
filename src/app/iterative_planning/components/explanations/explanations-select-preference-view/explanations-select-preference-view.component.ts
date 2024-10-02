import { PlanProperty } from "../../../domain/plan-property/plan-property";
import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { PlanPropertyMapService } from "src/app/service/plan-properties/plan-property-services";
import { Observable, combineLatest, Subject, BehaviorSubject } from "rxjs";
import { filter, map, take, takeUntil, tap } from "rxjs/operators";
import { LogEvent, TimeLoggerService } from "src/app/service/logger/time-logger.service";
import { CurrentProjectService } from "src/app/service/project/project-services";
import { GeneralSettings } from "src/app/interface/settings/general-settings";
import { IterationStep } from "src/app/iterative_planning/domain/iteration_step";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-explanations-select-preference-view",
  templateUrl: "./explanations-select-preference-view.component.html",
  styleUrls: ["./explanations-select-preference-view.component.scss"],
})
export class ExplanationsSelectPreferenceViewComponent implements OnInit {

  @Input()
  set step(step: IterationStep) {
    this.selectedPPId = "";
    this.step$.next(step);
  }
  @Output() selectedPP = new EventEmitter<string>();
  selectedPPId: string;

  possiblePP$: Observable<PlanProperty[]>;
  private step$ = new BehaviorSubject<IterationStep>(null);
  settings$: Observable<GeneralSettings>;

  constructor(
    private planpropertiesService: PlanPropertyMapService,
    private currentProjectService: CurrentProjectService
  ) {

    this.settings$ = currentProjectService.getSelectedObject().pipe(
      filter(p => !!p),
      map(p => p.settings)
    );

    this.possiblePP$ = combineLatest([
      this.step$,
      this.planpropertiesService.getMap(),
    ])
      .pipe(
        filter(
          ([step, properties]) => step && properties && properties.size > 0
        ),
        map(([step, properties]) => {
          const props = [];
          for (let property of properties.values()) {
            if (property.isUsed && !step.hardGoals.includes(property._id))
              props.push(property);
          }

          return props;
        })
      )
      .pipe(takeUntilDestroyed());
  }

  ngOnInit(): void {}


  selectPP(pp: PlanProperty): void {
    this.selectedPPId = pp._id;
    this.selectedPP.emit(pp._id);
  }
}
