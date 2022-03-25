import { ModIterationStep } from './../../../../interface/run';
import { PlanProperty } from 'src/app/interface/plan-property/plan-property';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { PlanPropertyMapService } from 'src/app/service/plan-properties/plan-property-services';
import { SelectedIterationStepService } from './../../../../service/planner-runs/selected-iteration-step.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IterationStep } from 'src/app/interface/run';
import { filter, map, takeUntil, tap } from 'rxjs/operators';

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

  possiblePP: PlanProperty[] = [];

  possiblePP$: Observable<PlanProperty[]>;

  constructor(
    private selectedIterationStepService: SelectedIterationStepService,
    private planpropertiesService: PlanPropertyMapService,
  ) {
    this.step$ = selectedIterationStepService.getSelectedObject();
    this.planPropertiesMap$ = planpropertiesService.getMap();

    this.possiblePP$ = combineLatest([this.step$, this.planPropertiesMap$])
      .pipe(
        filter(([step, properties]) => !!step && properties && properties.size > 0),
        map(([step, properties]) => {
          const props = [];

          for (let property of properties.values()) {

            props.push(property);
          }

          return props
            .filter(property => {
              const hardGoalIds = step.hardGoals.map(g => g._id);
              return property.isUsed && !hardGoalIds.includes(property._id)
            });
        })
      )
      .pipe(takeUntil(this.unsubscribe$));

      this.step$.subscribe(step => this.currentStep = step)


    // this.possiblePP$.subscribe(([step, planProperties]) => {
    //   if (step && planProperties) {
    //     this.currentStep = step;
    //     // this.possiblePP = [];
    //     // for (const pp of planProperties.values()) {
    //     //   if (!step.hardGoals.find(p => p._id === pp._id) && pp.isUsed) {
    //     //     this.possiblePP.push(pp);
    //     //   }
    //     // }
    //   }
    // });
  }

  ngOnInit() {
  }

  selectPP(pp: PlanProperty) {
    if (this.currentStep.canBeModified()) {
      this.currentStep.hardGoals.push(pp);
      this.selectedIterationStepService.saveObject(this.currentStep);
    }
    else {
      let modStep = new ModIterationStep('Next Step', this.currentStep)
      modStep.hardGoals.push(pp);
      this.selectedIterationStepService.saveObject(modStep);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
