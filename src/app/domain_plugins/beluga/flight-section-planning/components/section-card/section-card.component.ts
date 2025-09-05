import { Component, computed, inject, input } from '@angular/core';
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
import { sum } from 'ramda';
import { take } from 'rxjs';
import { ExplanationRunStatus } from 'src/app/iterative_planning/domain/explanation/explanations';
import { StepStatusColorPipe } from 'src/app/iterative_planning/domain/pipe/step-status-color.pipe';
import { StepStatusNamePipe } from 'src/app/iterative_planning/domain/pipe/step-status-name.pipe';
import { PlanRunStatus } from 'src/app/iterative_planning/domain/plan';
import { LabelModule } from 'src/app/shared/components/label/label.module';
import { Flight } from '../../../shared/domain/beluga_problem';
import { FlightSection } from '../../domain/flight-section';
import { computeRackOccupancyRate, computeSwaps } from '../../domain/metrics';
import { PlanMethod, PlanMethodType } from '../../domain/plan_method';
import { PlanMethodTypeIconPipe } from '../../pipe/plan-method-type-icon.pipe';
import { PlanMethodTypeNamePipe } from '../../pipe/plan-method-type-name.pipe';
import { cancelPlanning, createNewBranch, inspectPlan, registerManualPlanning, startAutomaticPlanning, updateConfigurationOfSectionAndConfigIndex } from '../../state/flight-section-planning.actions';
import { selectActiveBranchRemainingNumberFlights, selectBranchNames, selectIsAutomatic, selectIsManual, selectIsMixed, selectSupportedPlanners } from '../../state/flight-section-planning.selector';
import { BranchNameDialogComponent } from '../branch-name-dialog/branch-name-dialog.component';
import { ConfigurationSelectorComponent } from '../configuration-selector/configuration-selector.component';
import { SectionPlanMethodDialogComponent } from '../section-plan-method-dialog/section-plan-method-dialog.component';

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
    ConfigurationSelectorComponent,
  ],
  templateUrl: './section-card.component.html',
  styleUrl: './section-card.component.scss'
})
export class SectionCardComponent {

  store = inject(Store);
  readonly dialog = inject(MatDialog);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute)

  existingBranchNames = this.store.selectSignal(selectBranchNames);
  isAutomatic = this.store.selectSignal(selectIsAutomatic);
  isManual = this.store.selectSignal(selectIsManual);
  isMixed = this.store.selectSignal(selectIsMixed);
  supportedPlanners= this.store.selectSignal(selectSupportedPlanners);
  remainingNUmberFlights = this.store.selectSignal(selectActiveBranchRemainingNumberFlights);

  section = input.required<FlightSection>();
  originalFlight = input.required<Flight>();

  config = computed(() => this.section().configurations[this.section().configurationIndex]);
  selectedConfigSolvable = computed(() => this.config().explanationStatus == ExplanationRunStatus.FINISHED && this.config().explanations?.MUGS.length == 0);
  selectedConfigId = computed(() => this.section()?.configurationIndex);
  configurations = computed(() => this.section()?.configurations);

  numOutgoing = computed(() => this.config()?.flightTargetSchedule?.outgoing.length ?? undefined)
  numOutgoingConsidered = computed(() => this.config()?.flightTargetSchedule?.outgoing.filter(e => !e.skip).length ?? undefined)

  numIncoming = computed(() => this.config()?.flightTargetSchedule?.incoming.length ?? undefined)
  numIncomingConsidered = computed(() => this.config()?.flightTargetSchedule?.incoming.filter(e => !e.skip).length ?? undefined)

  numPossibleDeliveries = computed(() => sum(this.config()?.productionLinesTargetSchedule?.
    map(pl => ({...pl, schedule: pl.schedule.filter(e => !e.skip)})).
    map(pl => pl.schedule.length) ?? []))
  numOverallDeliveries = computed(() => sum(this.config()?.productionLinesTargetSchedule?.map(pl => pl.schedule.length) ?? []))

  highlighted = input<boolean>(false);


  isRunning = computed(() => this.section()?.status == PlanRunStatus.RUNNING);
  isPending = computed(() => this.section()?.status == PlanRunStatus.PENDING);

  hasManualPlan = computed(() => this.section()?.planMethod?.type == PlanMethodType.MANUAL);

  solved = computed(() => this.section()?.status == PlanRunStatus.SOLVED)
  notSolvable = computed(() => this.section()?.status === PlanRunStatus.NO_PLAN_FOUND || this.section()?.status === PlanRunStatus.UNSOLVABLE)
  failed = computed(() => this.section()?.status === PlanRunStatus.FAILED || this.section()?.status === PlanRunStatus.CANCELED)

  length = computed(() => ! this.solved() ? undefined : this.section()?.actions.length);
  swaps = computed(() => ! this.solved() ? undefined : computeSwaps(this.section()?.actions));
  rackOccupancyRate = computed(() => {
    if(!this.solved()){
      return undefined;
    }
    const v = computeRackOccupancyRate(this.section(), this.section()?.actions ?? []);
    return v !== undefined ? v.toFixed(2) : undefined;
  });

  onBranch(){
    const dialogRef = this.dialog.open(BranchNameDialogComponent, {data: {existingBranchNames: this.existingBranchNames()}});

    dialogRef.afterClosed().pipe(take(1)).subscribe((result: {name: string}) => {
      if (result !== undefined) {
        console.log(result);
        this.store.dispatch(createNewBranch({sectionId: this.section()._id, name: result.name}));
      }
    });
  }

  onPlanManually(){
    let method: PlanMethod = {
        name: 'Human Planner',
        type: PlanMethodType.MANUAL,
        numOptimizedFlights: 1
      }
      this.store.dispatch(registerManualPlanning({section: this.section(), method: method}))
  }

  onCreatePlan(){

    if(this.isAutomatic()){
      let method: PlanMethod = {
        name: 'AI Planner',
        type: PlanMethodType.AUTOMATIC_SEARCH_PLANNER,
        serviceId: this.supportedPlanners()[0]._id,
        numOptimizedFlights: 1
      }
      this.store.dispatch(startAutomaticPlanning({section: this.section(), method: method}))
      return;
    }

    const dialogRef = this.dialog.open(SectionPlanMethodDialogComponent, {
      data: {maxNumFlights: this.remainingNUmberFlights(), planners: this.supportedPlanners()},
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe((result: {method: PlanMethod}) => {
      this.store.dispatch(startAutomaticPlanning({section: this.section(), method: result.method}))
      }
    );
  }

  onInspectPlan(){
    this.store.dispatch(inspectPlan({sectionId: this.section()?._id}));
  }

  onCancel(){
    this.store.dispatch(cancelPlanning({section: this.section()}));
  }

  onUpdateConfiguration(){
    this.store.dispatch(updateConfigurationOfSectionAndConfigIndex({section: this.section(), index: this.section().configurationIndex}))
  }
}
