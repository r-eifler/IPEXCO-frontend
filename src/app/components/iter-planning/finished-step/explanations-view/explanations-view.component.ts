import { filter, map, take, takeUntil, tap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { SelectedIterationStepService } from 'src/app/service/planner-runs/selected-iteration-step.service';
import { DepExplanationRun, IterationStep } from 'src/app/interface/run';
import { PPConflict, PPDependencies } from './../../../../interface/explanations';
import { PlanProperty } from './../../../../interface/plan-property/plan-property';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlanPropertyMapService } from 'src/app/service/plan-properties/plan-property-services';
import { PlannerService } from 'src/app/service/planner-runs/planner.service';

@Component({
  selector: 'app-explanations-view',
  templateUrl: './explanations-view.component.html',
  styleUrls: ['./explanations-view.component.scss']
})
export class ExplanationsViewComponent implements OnInit, OnDestroy {

  private unsubscribe$: Subject<any> = new Subject();

  selectedPP: string;
  questions$ = new BehaviorSubject<PlanProperty>(null);
  selectedConflict$ = new BehaviorSubject<PPConflict>(null);

  step$ : Observable<IterationStep>;
  selectedDependencies$ = new BehaviorSubject<PPDependencies>(null);
  plannerBusy$ : BehaviorSubject<boolean>;
  displayExplanations$ : Observable<boolean>;
  planPropertiesMap$: BehaviorSubject<Map<string, PlanProperty>>;

  viewpos = 1;

  constructor(
    selectedIterationStepService: SelectedIterationStepService,
    planpropertiesService: PlanPropertyMapService,
    private plannerService: PlannerService,
  ) {
    this.step$ = selectedIterationStepService.findSelectedObject().pipe(filter(step => !!step));
    this.planPropertiesMap$ = planpropertiesService.getMap();
    this.plannerBusy$ = plannerService.isPlannerBusy();

    this.plannerBusy$.pipe(tap(a => a));

    this.step$.pipe(
      takeUntil(this.unsubscribe$),
      filter(step => !!step)).subscribe(
        step =>{
          console.log(step);
          this.questions$.next(null);
          this.selectedDependencies$.next(null);
          this.selectedConflict$.next(null);
          this.viewpos = 1;
        }
      );
    this.displayExplanations$ = this.step$.pipe(
      filter(step => !!step),
      map(step => step.relaxationExplanations && step.relaxationExplanations.length > 0),
      tap(a => a)
    )
  }

  ngOnInit(): void {
  }

  selectQuestion(id : string): void {
    this.selectedPP = id
    combineLatest([this.step$, this.planPropertiesMap$]).
    pipe(take(1)).subscribe(
      ([step, planProperties]) => {
        if (step && planProperties) {
          // if (step.getDepExplanation(this.selectedPP)){
            this.selectedDependencies$.next(step.getDependencies(this.selectedPP))
            this.questions$.next(planProperties.get(this.selectedPP));
          //   return
          // }
          // let exp = this.plannerService.computeMUGS(step, [this.selectedPP], Array.from(planProperties.values()));
          // this.selectedDepExp$.next(exp);
        }
      }
    );
  }


  selectConflict(conflict : PPConflict): void {
    this.viewpos = 2;
    console.log("selectConflict");
    console.log(conflict);
    this.selectedConflict$.next(conflict);
  }

  computeExplanations(): void {
    this.step$.pipe(filter(step => !!step), take(1)).subscribe(
      step => {
        this.plannerService.computeRelaxExplanations(step);
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}


