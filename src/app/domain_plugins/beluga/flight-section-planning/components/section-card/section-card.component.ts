import { Component, computed, effect, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { StepStatusColorPipe } from 'src/app/iterative_planning/domain/pipe/step-status-color.pipe';
import { StepStatusNamePipe } from 'src/app/iterative_planning/domain/pipe/step-status-name.pipe';
import { PlanRunStatus } from 'src/app/iterative_planning/domain/plan';
import { LabelModule } from 'src/app/shared/components/label/label.module';
import { Flight } from '../../../shared/domain/beluga_problem';
import { FlightSection, getFullState } from '../../domain/flight-section';
import { computeRackOccupancyRate, computeSwaps } from '../../domain/metrics';
import { PlanMethod, PlanMethodType } from '../../domain/plan_method';
import { createNewBranch, registerManualPlanning, startAutomaticPlanning } from '../../state/flight-section-planning.actions';
import { selectActiveBranchRemainingNumberFlights, selectSupportedPlanners, selectTask } from '../../state/flight-section-planning.selector';
import { PlanInspectorComponent } from '../../views/plan-inspector/plan-inspector.component';
import { SectionPlanMethodDialogComponent } from '../section-plan-method-dialog/section-plan-method-dialog.component';
import { BranchNameDialogComponent } from '../branch-name-dialog/branch-name-dialog.component';
import { PlanMethodTypeNamePipe } from '../../pipe/plan-method-type-name.pipe';
import { PlanMethodTypeIconPipe } from '../../pipe/plan-method-type-icon.pipe';
import { sum } from 'ramda';

@Component({
  selector: 'app-section-card',
  imports: [
    MatCardModule, 
    MatChipsModule,  
    MatIconModule, 
    LabelModule, 
    MatButtonModule, 
    MatTooltipModule, 
    MatProgressBarModule,
    TranslocoModule,
    StepStatusColorPipe,
    StepStatusNamePipe,
    RouterLink,
    MatProgressBarModule,
    PlanMethodTypeNamePipe,
    PlanMethodTypeIconPipe,
  ],
  templateUrl: './section-card.component.html',
  styleUrl: './section-card.component.scss'
})
export class SectionCardComponent {

  store = inject(Store);
  readonly dialog = inject(MatDialog);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute)

  supportedPlanners= this.store.selectSignal(selectSupportedPlanners);
  task = this.store.selectSignal(selectTask);
  remainingNUmberFlights = this.store.selectSignal(selectActiveBranchRemainingNumberFlights);

  section = input.required<FlightSection>();
  originalFlight = input.required<Flight>();

  numOutgoing = computed(() => this.section()?.flightTargetSchedule?.outgoing.length ?? undefined)
  numIncoming = computed(() => this.section()?.flightTargetSchedule?.incoming.length ?? undefined)
  numDeliveries = computed(() => sum(this.section()?.productionLinesTargetSchedule?.map(pl => pl.schedule.length) ?? []))

  goalsDefined = computed(() => this.section()?.flightTargetSchedule !== undefined && this.section()?.productionLinesTargetSchedule !== undefined)
  isRunning = computed(() => this.section()?.status == PlanRunStatus.RUNNING);

  constructor(){
    effect(() => console.log(this.goalsDefined()))
  }

  highlighted = input<boolean>(false);

  hasNoPlan = computed(() => this.section()?.status !== PlanRunStatus.SOLVED && this.section()?.status !== PlanRunStatus.UNSOLVABLE)


  length = computed(() => this.hasNoPlan() ? undefined : this.section()?.actions.length);
  swaps = computed(() => this.hasNoPlan() ? undefined : computeSwaps(this.section()?.actions));
  rackOccupancyRate = computed(() => {
    if(this.hasNoPlan()){
      return undefined;
    }
    const task = this.task();
    const startState  = getFullState(this.section());
    if(task === undefined || startState === undefined){
      return undefined;
    }
    const v = computeRackOccupancyRate(task, startState, this.section()?.actions ?? []);
    return v !== undefined ? v.toFixed(2) : undefined;
  });

  onBranch(){
    const dialogRef = this.dialog.open(BranchNameDialogComponent);

    dialogRef.afterClosed().pipe(take(1)).subscribe((result: {name: string}) => {
      if (result !== undefined) {
        console.log(result);
        this.store.dispatch(createNewBranch({sectionId: this.section()._id, name: result.name}));
      }
    });
  }

  onInspectPlan(){
    const dialogRef = this.dialog.open(PlanInspectorComponent, {
      data: {task: this.task, section: this.section()},
    });
  }

  onCreatePlan(){
    const dialogRef = this.dialog.open(SectionPlanMethodDialogComponent, {
      data: {maxNumFlights: this.remainingNUmberFlights(), planners: this.supportedPlanners()},
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe((result: {method: PlanMethod}) => {
      if (result !== undefined) {
        console.log(result);
        if(result.method.type == PlanMethodType.MANUAL){
          this.store.dispatch(registerManualPlanning({section: this.section(), method: result.method}))
        }
        if(result.method.type == PlanMethodType.AUTOMATIC_SEARCH_PLANNER){
          this.store.dispatch(startAutomaticPlanning({section: this.section(), method: result.method}))
        }
      }
    });
  }

  onCancel(){

  }
}
