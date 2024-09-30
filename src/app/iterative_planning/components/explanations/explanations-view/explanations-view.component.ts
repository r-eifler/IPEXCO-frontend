import { GeneralSettings } from 'src/app/interface/settings/general-settings';
import { LogEvent, TimeLoggerService } from 'src/app/service/logger/time-logger.service';
import { filter, map, take, takeUntil, tap } from "rxjs/operators";
import { BehaviorSubject, combineLatest, Observable, Subject } from "rxjs";
import { SelectedIterationStepService } from "src/app/service/planner-runs/selected-iteration-step.service";
import { PlanProperty } from "../../../domain/plan-property/plan-property";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { PlanPropertyMapService } from "src/app/service/plan-properties/plan-property-services";
import { PlannerService } from "src/app/service/planner-runs/planner.service";
import { FinishedStepInterfaceStatusService } from "src/app/service/user-interface/interface-status-services";
import { FinishedStepInterfaceStatus } from "src/app/interface/interface-status";
import { CurrentProjectService } from "src/app/service/project/project-services";

import { MatStepper } from '@angular/material/stepper';
import { PPConflict, PPDependencies } from 'src/app/iterative_planning/domain/explanations';
import { getDependencies, getDependenciesForUnsolvability, IterationStep, StepStatus } from 'src/app/iterative_planning/domain/run';

@Component({
  selector: "app-explanations-view",
  templateUrl: "./explanations-view.component.html",
  styleUrls: ["./explanations-view.component.scss"],
})
export class ExplanationsViewComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<any> = new Subject();

  selectedPP: string;
  questions$ = new BehaviorSubject<PlanProperty>(null);
  selectedConflict$ = new BehaviorSubject<PPConflict>(null);

  step$: Observable<IterationStep>;
  iterfaceStati$: Observable<FinishedStepInterfaceStatus[]>;
  interfaceStatus: FinishedStepInterfaceStatus;
  computedDependencies$ = new BehaviorSubject<PPDependencies>(null);
  plannerBusy$: BehaviorSubject<boolean>;
  displayExplanations$: Observable<boolean>;
  notSolvable$: Observable<boolean>;
  planPropertiesMap$: BehaviorSubject<Map<string, PlanProperty>>;
  provideRelaxationExplanations$: Observable<boolean>;
  settings$: Observable<GeneralSettings>;

  view_pos = 0;

  constructor(
    private timeLogger: TimeLoggerService,
    selectedIterationStepService: SelectedIterationStepService,
    planpropertiesService: PlanPropertyMapService,
    private finishedStepInterfaceStatusService: FinishedStepInterfaceStatusService,
    private plannerService: PlannerService,
    private currentProjectService: CurrentProjectService,
  ) {
    this.step$ = selectedIterationStepService
      .findSelectedObject()
      .pipe(filter((step) => !!step));
    this.planPropertiesMap$ = planpropertiesService.getMap();
    this.plannerBusy$ = plannerService.isPlannerBusy();
    this.iterfaceStati$ = finishedStepInterfaceStatusService.getList();
    this.settings$ = currentProjectService.getSelectedObject().pipe(
      filter(p => !!p),
      map(p => p.settings)
    );

    this.provideRelaxationExplanations$ = this.currentProjectService
      .getSelectedObject()
      .pipe(
        filter((p) => !!p),
        map((project) => project.settings.provideRelaxationExplanations),
        tap((p) => console.log(p))
      );

    combineLatest([this.step$, this.settings$])
      .pipe(
        filter(([step, settings]) => !!step && !!settings),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(([step, settings]) => {
        console.log(step.status);
        if (step.status == StepStatus.unsolvable) {
          console.log("Step not solvable.");
          this.stepNotSolvable(step);
        }
        if((!step.depExplanation && !step.relaxationExplanations)
        && settings.computeDependenciesAutomatically){
          console.log("ExplanationView: compute explanations automatically...")
          this.computeExplanations();
        }
      });

      this.step$.subscribe(data => {
        const x= data;
      });
      this.iterfaceStati$.subscribe(data => {
        const x= data;
      });
      this.planPropertiesMap$.subscribe(data => {
        const x= data;
      });

    combineLatest([this.step$, this.iterfaceStati$, this.planPropertiesMap$])
      .pipe(
        tap(console.log),
        filter(
          ([step, stati, planProperties]) =>
            !!step && !!stati && !!planProperties
        ),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(([step, stati, planProperties]) => {
        console.log();
        let status: FinishedStepInterfaceStatus = stati.find(
          (s) => s._id == step._id
        );
        if (this.interfaceStatus == status) {
          return;
        }
        this.interfaceStatus = status;
        console.log(status)
        if (status) {
          this.selectedPP = status.question;
          this.questions$.next(planProperties.get(this.selectedPP));
          this.computedDependencies$.next(status.dependencies);
          this.selectedConflict$.next(status.conflict);
          this.view_pos = status.viewPos;
        } else {
          this.questions$.next(null);
          this.computedDependencies$.next(null);
          this.selectedConflict$.next(null);
          this.view_pos = 0;
        }
      });

    this.displayExplanations$ = this.step$.pipe(
      filter((step) => !!step),
      map(
        (step) =>
          !!step.depExplanation ||
          (step.relaxationExplanations &&
            step.relaxationExplanations.length > 0)
      )
    );

    this.notSolvable$ = this.step$.pipe(
      filter((step) => !!step),
      map((step) => step.status == StepStatus.unsolvable)
    );
  }

  ngOnInit(): void {

  }

  stepNotSolvable(step: IterationStep): void {
    let dependencies = getDependenciesForUnsolvability(step);
    this.computedDependencies$.next(dependencies);
    this.questions$.next(null);
    // this.viewpos = 2;

    if (this.interfaceStatus) {
      this.interfaceStatus = {
        _id: this.interfaceStatus._id,
        tab: this.interfaceStatus.tab,
        question: null,
        dependencies,
        conflict: null,
        viewPos: 2,
      };
    } else {
      this.interfaceStatus = {
        _id: step._id,
        tab: 5,
        question: this.selectedPP,
        dependencies,
        conflict: null,
        viewPos: 2,
      };
    }
    this.finishedStepInterfaceStatusService.saveObject(this.interfaceStatus);
  }

  selectQuestion(id: string): void {
    this.selectedPP = id;
    combineLatest([this.step$, this.planPropertiesMap$])
      .pipe(
        filter(([step, planProperties]) => !!step && !!planProperties),
        take(1)
      )
      .subscribe(([step, planProperties]) => {
        this.timeLogger.log(LogEvent.ASK_CONFLICT_QUESTION, {stepId: step._id, selectedPP: id})
        let dependencies = getDependencies(step, this.selectedPP);
        this.computedDependencies$.next(dependencies);
        this.questions$.next(planProperties.get(this.selectedPP));

        if (this.interfaceStatus) {
          this.interfaceStatus = {
            _id: this.interfaceStatus._id,
            tab: this.interfaceStatus.tab,
            question: this.selectedPP,
            dependencies,
            conflict: null,
            viewPos: 1,
          };
        } else {
          this.interfaceStatus = {
            _id: step._id,
            tab: 5,
            question: this.selectedPP,
            dependencies,
            conflict: null,
            viewPos: 1,
          };
        }
        this.finishedStepInterfaceStatusService.saveObject(
          this.interfaceStatus
        );
      });
  }

  selectConflict(conflict: PPConflict, stepper: MatStepper): void {
    this.timeLogger.log(LogEvent.ASK_RELAXATION_QUESTION, {conflict: conflict})
    this.view_pos = 1;
    stepper.next()
    this.selectedConflict$.next(conflict);
    this.interfaceStatus = { ...this.interfaceStatus, conflict, viewPos: 2 };
    this.finishedStepInterfaceStatusService.saveObject(this.interfaceStatus);
  }

  computeExplanations(): void {
    combineLatest([this.step$])
      .pipe(
        filter(([step]) => !!step),
        take(1)
      )
      .subscribe(([step]) => {
          this.plannerService.computeMUGS(step);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
