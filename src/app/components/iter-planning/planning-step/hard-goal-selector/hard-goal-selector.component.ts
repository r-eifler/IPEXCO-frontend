import { PlannerService } from 'src/app/service/planner-runs/planner.service';
import { ModIterationStep } from './../../../../interface/run';
import { PlanProperty } from 'src/app/interface/plan-property/plan-property';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { PlanPropertyMapService } from 'src/app/service/plan-properties/plan-property-services';
import { SelectedIterationStepService } from './../../../../service/planner-runs/selected-iteration-step.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IterationStep } from 'src/app/interface/run';
import { filter, map, take, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-hard-goal-selector',
  templateUrl: './hard-goal-selector.component.html',
  styleUrls: ['./hard-goal-selector.component.css']
})
export class HardGoalSelectorComponent implements OnInit, OnDestroy {

  private unsubscribe$: Subject<any> = new Subject();

  step$: BehaviorSubject<IterationStep>;
  currentStep: IterationStep;
  planPropertiesMap$: BehaviorSubject<Map<string, PlanProperty>>;

  possiblePP$: Observable<PlanProperty[]>;

  withConlicts$: Observable<PlanProperty[]>;
  withoutConlicts$: Observable<PlanProperty[]>;
  unknownConflicts$: Observable<PlanProperty[]>;

  display = new Set<string>();

  constructor(
    private selectedIterationStepService: SelectedIterationStepService,
    private planpropertiesService: PlanPropertyMapService,
    private plannerService: PlannerService,
  ) {
    this.step$ = selectedIterationStepService.getSelectedObject();
    this.planPropertiesMap$ = planpropertiesService.getMap();

    this.possiblePP$ = combineLatest([this.step$, this.planPropertiesMap$])
      .pipe(
        filter(([step, properties]) => !!step && properties && properties.size > 0),
        map(([step, properties]) => {
          const props = [];
          for (let property of properties.values()) {
            if (property.isUsed && !step.hardGoals.includes(property._id))
              props.push(property);
          }

          return props
        })
      )
      .pipe(takeUntil(this.unsubscribe$));

      this.step$.pipe(takeUntil(this.unsubscribe$)).
        subscribe(step => this.currentStep = step)
  }

  ngOnInit() {
  }

  selectPP(pp: PlanProperty) {
    if (this.currentStep.canBeModified()) {
      this.currentStep.hardGoals.push(pp._id);
      this.selectedIterationStepService.saveObject(this.currentStep);
    }
    else {
      let modStep = new ModIterationStep('Next Step', this.currentStep)
      modStep.hardGoals.push(pp._id);
      this.selectedIterationStepService.saveObject(modStep);
    }
  }

  askQuestion(pp: PlanProperty){
    if(this.display.has(pp._id)){
      this.display.delete(pp._id);
      return
    }
    else {
      this.display.add(pp._id);
    }
    combineLatest([this.step$, this.planPropertiesMap$]).
    pipe(take(1)).subscribe(
      ([step, planProperties]) => {
        if (step && planProperties) {

          if (step.getDepExplanation(pp._id)){
              return
          }
          this.plannerService.computeMUGS(step, [pp._id], Array.from(planProperties.values()));
        }
      }
    );

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
