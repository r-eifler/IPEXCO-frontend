import { ModIterationStep } from './../../../../interface/run';
import { PlanProperty } from 'src/app/interface/plan-property/plan-property';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { PlanPropertyMapService } from 'src/app/service/plan-properties/plan-property-services';
import { SelectedIterationStepService } from './../../../../service/planner-runs/selected-iteration-step.service';
import { Component, OnInit } from '@angular/core';
import { IterationStep } from 'src/app/interface/run';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-hard-goal-selector',
  templateUrl: './hard-goal-selector.component.html',
  styleUrls: ['./hard-goal-selector.component.css']
})
export class HardGoalSelectorComponent implements OnInit {

  private ngUnsubscribe: Subject<any> = new Subject();

  step$: BehaviorSubject<IterationStep>;
  currentStep: IterationStep;
  planPropertiesMap$: BehaviorSubject<Map<string, PlanProperty>>;

  possiblePP: PlanProperty[] = [];

  constructor(
    private selectedIterationStepService: SelectedIterationStepService,
    private planpropertiesService: PlanPropertyMapService,
  ) {
    this.step$ = selectedIterationStepService.getSelectedObject();
    this.planPropertiesMap$ = planpropertiesService.getMap();

    combineLatest([this.step$, this.planPropertiesMap$])
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(([step, planProperties]) => {
      if (step && planProperties) {
        this.currentStep = step;
        this.possiblePP = [];
        for (const pp of planProperties.values()) {
          if (!step.hardGoals.find(p => p._id === pp._id) && pp.isUsed) {
            this.possiblePP.push(pp);
          }
        }
      }
    });
  }

  ngOnInit() {
  }

  selectPP(pp: PlanProperty) {
    if(this.currentStep.canBeModified()){
      this.currentStep.hardGoals.push(pp);
      this.currentStep.softGoals = this.currentStep.softGoals.filter(p => p._id !== pp._id);
      this.selectedIterationStepService.saveObject(this.currentStep);
    }
    else {
      let modStep = new ModIterationStep('Next Step', this.currentStep)
      modStep.hardGoals.push(pp);
      modStep.softGoals = modStep.softGoals.filter(p => p._id !== pp._id)
      this.selectedIterationStepService.saveObject(modStep);
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
