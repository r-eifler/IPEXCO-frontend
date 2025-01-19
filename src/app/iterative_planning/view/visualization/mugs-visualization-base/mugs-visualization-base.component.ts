import {Component, inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {selectIterativePlanningProperties, selectIterativePlanningSelectedStep} from '../../../state/iterative-planning.selector';
import {catchError, map, take} from 'rxjs/operators';
import {filter, Observable, of} from 'rxjs';
import {registerGlobalExplanationComputation} from '../../../state/iterative-planning.actions';
import {selectEnforcedGoals} from '../../plan-detail-view/plan-detail-view.component.selector';
import {selectSoftGoals} from './mugs-visualization-base.component.selector';
import {VisualizationLauncher} from './legacy/visualization-launcher';
import {PlanProperty} from '../../../../shared/domain/plan-property/plan-property';
import {PlanRunStatus} from '../../../domain/plan';
import {AsyncPipe} from '@angular/common';
import {PageSectionTitleComponent} from '../../../../shared/components/page/page-section-title/page-section-title.component';
import {PageSectionComponent} from '../../../../shared/components/page/page-section/page-section.component';
import {PageSectionContentComponent} from '../../../../shared/components/page/page-section-content/page-section-content.component';
import {PageComponent} from '../../../../shared/components/page/page/page.component';
import {PageContentComponent} from '../../../../shared/components/page/page-content/page-content.component';
import {PlanPropertyBadgeComponent} from '../../../../shared/components/plan-property-badge/plan-property-badge.component';
import {EditableListEntryComponent} from '../../../../shared/components/editable-list/editable-list-entry/editable-list-entry.component';
import {
  EditableListEntrySuffixComponent
} from '../../../../shared/components/editable-list/editable-list-entry-suffix/editable-list-entry-suffix.component';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {UIControls} from './legacy/ui-controls';


@Component({
  selector: 'app-mugs-visualization-base',
  standalone: true,
  imports: [
    AsyncPipe,
    PageSectionTitleComponent,
    PageSectionComponent,
    PageSectionContentComponent,
    PageComponent,
    PageContentComponent,
    PlanPropertyBadgeComponent,
    EditableListEntryComponent,
    EditableListEntrySuffixComponent,
    MatIcon,
    MatIconButton
  ],
  templateUrl: './mugs-visualization-base.component.html',
  styleUrl: './mugs-visualization-base.component.scss'
})
export class MugsVisualizationBaseComponent {
  private store = inject(Store);
  private visualizationLauncher: VisualizationLauncher;
  private uiControl: UIControls;

  //
  // Observables
  //
  step$ = this.store.select(selectIterativePlanningSelectedStep);
  stepId$ = this.step$.pipe(map(step => step?._id));
  stepGlobalExplanation$ = this.step$.pipe(map(step => step?.globalExplanation));

  //
  // Class fields
  //
  containerHeaderId: string = "mugs-vis";
  containerGoalInteractionSectionTest: string = "";
  stepGoals : Record<string, string> = {};
  stepStatusType: PlanRunStatus;
  MUGS : string[][] = [];
  MSGS : string[][] = [];
  enforcedGoals : PlanProperty[] = [];
  enfGoals: string[] = [];
  MUGTypes: Record<string, number> = {};
  planProperties: PlanProperty[] = [];
  selectedPlanProperties: PlanProperty[] = [];

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
    this.setStepHeaderText();
    this.computeExplanations();
    this.computeStepGoals();
    this.computeStepGoalIntCategory();
    this.mapExplanationsToStepGoals();
  }

  ngAfterViewInit(): void {
    this.initializeVisualizationLauncher();
  }

  private setStepHeaderText(){
    this.step$.pipe(
      filter((step) => !!step),
      map((step) => step.plan?.status)
    ).subscribe((status) => {
      this.stepStatusType = status;
      switch (status) {
        case PlanRunStatus.not_solvable:
          this.containerGoalInteractionSectionTest = "Unenforced Goals"
          break;

        case PlanRunStatus.failed:
          this.explanationDetails$ = undefined;
          console.log('MUG-Visualization-Base: Unexpected Step:', status);
          break;

        case PlanRunStatus.pending:
          this.explanationDetails$ = undefined;
          console.log('MUG-Visualization-Base: Unexpected Step:', status);
          break;

        case PlanRunStatus.running:
          this.explanationDetails$ = undefined;
          console.log('MUG-Visualization-Base: Unexpected Step:', status);
          break;

        default:
          this.containerGoalInteractionSectionTest = "Enforced Goals"
      }
    });
  }

  private initializeVisualizationLauncher(): void {
    if (Object.keys(this.MUGS).length == 0 || Object.keys(this.MSGS).length == 0) {return ;}
    this.visualizationLauncher = new VisualizationLauncher(this.MUGS, this.MSGS, this.MUGTypes, this.stepStatusType);
    this.visualizationLauncher.initialize(`#${this.containerHeaderId}`, this.planProperties, this.selectedPlanProperties);

    this.uiControl = this.visualizationLauncher.getUIControlsInstance();

    this.uiControl.selectionChanged.subscribe(change => {
      this.selectedPlanProperties = change;
    });

    if (this.stepStatusType != PlanRunStatus.not_solvable){
      this.uiControl.ForceEnforceGoalsToSelection(this.enforcedGoals);
    }

  }

  private computeStepGoalIntCategory(): void{
    if (Object.keys(this.stepGoals).length == 0) { return ; }

    let actionsClassToInt: Record<string, number> = {};
    let planProperties: Observable<Record<string, PlanProperty>> = this.store.select(selectIterativePlanningProperties);
    let counter = 0;

    planProperties.pipe(take(1)).subscribe(properties => {
      Object.values(properties).forEach((property: PlanProperty) => {
        if (property._id in this.stepGoals){
          const actionName = property.name;
          const actionClass = property.class;
          if(!(actionClass in actionsClassToInt)){
            actionsClassToInt[actionClass] = counter++;
          }
          this.MUGTypes[actionName] = actionsClassToInt[actionClass];
          this.planProperties.push(property);
        }
      });
    });

    // Set Enforced Goals
    this.planProperties.forEach(property => {
      if (this.enfGoals.includes(property.name)){
        this.enforcedGoals.push(property);
      }
    })
  }

  private computeStepGoals(){
    if (this.explanationDetails$ == undefined) {
      return;
    }

    this.store.select(selectEnforcedGoals).pipe(take(1)).subscribe(enforcedGoals => {
      enforcedGoals.forEach((goal) =>{
        this.stepGoals[goal._id] = goal.name
        this.enfGoals.push(goal.name);
      })
    });

    this.store.select(selectSoftGoals).pipe(take(1)).subscribe(softGoals => {
      softGoals.forEach((goal) =>{
        this.stepGoals[goal._id] = goal.name
      })
    });

  }

  private computeExplanations() : void{
    this.stepId$.pipe(take(1)).subscribe(stepId => {
      console.log('MUG-Visualization-Base: Register Global Computation for StepId:', stepId);
      this.store.dispatch(registerGlobalExplanationComputation({iterationStepId: stepId}));
    });
  }

  private mapExplanationsToStepGoals(){
    if (Object.keys(this.stepGoals).length == 0) { return ; }

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
      console.log(this.MUGS)
    });
  }

  protected readonly PlanRunStatus = PlanRunStatus;

  protected removeselectedPlanProperty(prop: PlanProperty): void
  {
    this.selectedPlanProperties = this.selectedPlanProperties.filter((property: PlanProperty) => property._id !== prop._id);
    this.uiControl.updateEnforcementSection(prop)
    this.uiControl.updateGoalSelectionView()
  }
}
