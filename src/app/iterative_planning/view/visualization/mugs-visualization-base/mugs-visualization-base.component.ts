import {Component, inject} from '@angular/core';
import {DOCUMENT, NgForOf, NgIf} from '@angular/common';
import {Store} from '@ngrx/store';
import {selectIterativePlanningProperties, selectIterativePlanningSelectedStep} from '../../../state/iterative-planning.selector';
import {catchError, map, take} from 'rxjs/operators';
import {of} from 'rxjs';
import {registerGlobalExplanationComputation} from '../../../state/iterative-planning.actions';
import {selectEnforcedGoals} from '../../plan-detail-view/plan-detail-view.component.selector';
import {selectSoftGoals} from './mugs-visualization-base.component.selector';
import {VisualizationLauncher} from './legacy/visualization-launcher';
import {DataHandlerService} from './legacy/DataHandlerService';


@Component({
  selector: 'app-mugs-visualization-base',
  standalone: true,
  imports: [

  ],
  templateUrl: './mugs-visualization-base.component.html',
  styleUrl: './mugs-visualization-base.component.scss'
})
export class MugsVisualizationBaseComponent {
  private store = inject(Store);
  private visualizationLauncher: VisualizationLauncher;

  step$ = this.store.select(selectIterativePlanningSelectedStep);
  //
  test$ = this.store.select(selectIterativePlanningProperties); //TODO: Mapping 'PlanProperty' (Shared/Domain/PlanProperty)
  //
  stepId$ = this.step$.pipe(map(step => step?._id));
  stepGlobalExplanation$ = this.step$.pipe(map(step => step?.globalExplanation));

  stepGoals : Record<string, string> = {};
  MUGS : string[][] = []
  MSGS : string[][] = []
  MUGTypes: Record<string, number> = {};

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
    this.computeExplanations();
    this.computeStepGoals();
    this.mapExplanationsToStepGoals();
    this.initializeVisualizationLauncher();
  }

  private initializeVisualizationLauncher(): void {
    this.visualizationLauncher = new VisualizationLauncher(this.MUGS, this.MSGS, this.MUGTypes);
    this.visualizationLauncher.initialize("#mugs-vis");
  }

  private computeExplanations() : void{
    this.stepId$.pipe(take(1)).subscribe(stepId => {
      console.log('MUG-Visualization-Base: Register Global Computation for StepId:', stepId);
      this.store.dispatch(registerGlobalExplanationComputation({iterationStepId: stepId}));
    });
  }

  private computeStepGoals(){
    if (this.explanationDetails$ == undefined) {
      return;
    }

    this.store.select(selectEnforcedGoals).pipe(take(1)).subscribe(enforcedGoals => {
      enforcedGoals.forEach((goal) =>{
        this.stepGoals[goal._id] = goal.name
      })
    });

    this.store.select(selectSoftGoals).pipe(take(1)).subscribe(softGoals => {
      softGoals.forEach((goal) =>{
        this.stepGoals[goal._id] = goal.name
      })
    });

  }

  private mapExplanationsToStepGoals(){
    if (this.explanationDetails$ == undefined) {
      return;
    }
    const allG = Object.keys(this.stepGoals);
    this.explanationDetails$.pipe(take(1)).subscribe(explanation =>
    {
      const mappedMUGS: string[][] = explanation.MUGS.map((goals: string[]) =>
        goals.map(goalId => {
          const goal = this.stepGoals[goalId];
          return goal || goalId;
        })
      );

      const mappedMSGS: string[][] = explanation.MGCS.map((goals: string[]) =>
      {
        return allG
          .filter(goalId => !goals.includes(goalId))
          .map(goalId => this.stepGoals[goalId]|| goalId)
      });

      this.MUGS = mappedMUGS;
      this.MSGS = mappedMSGS;

    }).unsubscribe();
  }
}
