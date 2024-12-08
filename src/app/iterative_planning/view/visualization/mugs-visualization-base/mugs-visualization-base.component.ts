import {Component, inject} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {Store} from '@ngrx/store';
import {selectIterativePlanningSelectedStep} from '../../../state/iterative-planning.selector';
import {catchError, map, take, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {registerGlobalExplanationComputation} from '../../../state/iterative-planning.actions';
import {selectEnforcedGoals} from '../../plan-detail-view/plan-detail-view.component.selector';
import {selectSoftGoals} from './mugs-visualization-base.component.selector';
import {ComponentVisualizer} from './utils/component-visualizer';


@Component({
  selector: 'app-mugs-visualization-base',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
  ],
  templateUrl: './mugs-visualization-base.component.html',
  styleUrl: './mugs-visualization-base.component.scss'
})
export class MugsVisualizationBaseComponent {
  private store = inject(Store);
  componentVisualizer: ComponentVisualizer;
  step$ = this.store.select(selectIterativePlanningSelectedStep);
  stepId$ = this.step$.pipe(map(step => step?._id));
  stepGlobalExplanation$ = this.step$.pipe(map(step => step?.globalExplanation));

  stepGoals$ : Record<string, string> = {};
  MUGS$ : string[][] = []
  MSGS$ : string[][] = []

  explanationDetails$ = this.stepGlobalExplanation$.pipe(
    map((explanation) => ({
      MUGS: explanation?.MUGS,
      MGCS: explanation?.MGCS,
    })),
    catchError(() => {
      console.error('MUG-Visualization-Base: Failed to load explanation details');
      return of({ MUGS: [], MGCS: [] });
    })
  )

  ngOnInit() : void {
    if (this.explanationDetails$ == undefined){
      this.computeExplanations();
    }
    this.computeStepGoals();
    this.mapExplanationsToStepGoals();
    this.componentVisualizer = new ComponentVisualizer(this.MUGS$, this.MSGS$);
    this.componentVisualizer.computeCrossReference();
  }

  computeExplanations() : void{
    this.stepId$.pipe(take(1)).subscribe(stepId => {
      console.log('MUG-Visualization-Base: Register Global Computation for StepId:', stepId);
      this.store.dispatch(registerGlobalExplanationComputation({iterationStepId: stepId}));
    })
  }

  computeStepGoals(){
    if (this.explanationDetails$ == undefined) {
      return;
    }

    let enforcedGoals = this.store.select(selectEnforcedGoals)
    let softGoals = this.store.select(selectSoftGoals)

    enforcedGoals.subscribe(goals =>{
      goals.forEach((goal) =>{
        this.stepGoals$[goal._id] = goal.name
      })
    })

    softGoals.subscribe(goals =>{
      goals.forEach((goal) =>{
        this.stepGoals$[goal._id] = goal.name
      })
    })

  }

  mapExplanationsToStepGoals(){
    if (this.explanationDetails$ == undefined) {
      return;
    }
    const allG = Object.keys(this.stepGoals$);
    this.explanationDetails$.subscribe(explanation =>
    {
      const mappedMUGS: string[][] = explanation.MUGS.map((goals: string[]) =>
        goals.map(goalId => {
          const goal = this.stepGoals$[goalId];
          return goal || goalId;
        })
      );

      const mappedMSGS: string[][] = explanation.MGCS.map((goals: string[]) =>
      {
        return allG
          .filter(goalId => !goals.includes(goalId))
          .map(goalId => this.stepGoals$[goalId]|| goalId)
      });

      this.MUGS$ = mappedMUGS;
      this.MSGS$ = mappedMSGS;

    });
  }
}
