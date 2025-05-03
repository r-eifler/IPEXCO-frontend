import { Component, computed, inject, input } from '@angular/core';
import { FlightSection } from '../../domain/flight-section';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { LabelModule } from 'src/app/shared/components/label/label.module';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslocoModule } from '@jsverse/transloco';
import { Flight } from '../../../shared/domain/beluga_problem';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { StepStatusColorPipe } from 'src/app/iterative_planning/domain/pipe/step-status-color.pipe';
import { StepStatusNamePipe } from 'src/app/iterative_planning/domain/pipe/step-status-name.pipe';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PlanRunStatus } from 'src/app/iterative_planning/domain/plan';
import { computeSwaps, computeRackOccupancyRate } from '../../domain/metrics';
import { Store } from '@ngrx/store';
import { selectRemainingNumberFlights, selectSupportedPlanners, selectTask } from '../../state/flight-section-planning.selector';
import { MatDialog } from '@angular/material/dialog';
import { SectionPlanMethodDialogComponent } from '../section-plan-method-dialog/section-plan-method-dialog.component';
import { PlanMethod, PlanMethodType } from '../../domain/plan_method';
import { registerManualPlanning } from '../../state/flight-section-planning.actions';
import { take } from 'rxjs';

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
    RouterLink
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
  remainingNUmberFlights = this.store.selectSignal(selectRemainingNumberFlights);

  section = input.required<FlightSection>();
  flight = input.required<Flight>();

  numOutgoing = computed(() => this.flight()?.outgoing.length ?? 0)
  numIncoming = computed(() => this.flight()?.incoming.length ?? 0)

  highlighted = input<boolean>(false);

  hasNoPlan = computed(() => this.section()?.status !== PlanRunStatus.SOLVED && this.section()?.status !== PlanRunStatus.UNSOLVABLE)


  length = computed(() => this.hasNoPlan() ? undefined : this.section()?.actions.length);
  swaps = computed(() => this.hasNoPlan() ? undefined : computeSwaps(this.section()?.actions));
  rackOccupancyRate = computed(() => {
    if(this.hasNoPlan()){
      return undefined;
    }
    const task = this.task();
    const startState  = this.section().startState;
    if(task === undefined || startState === undefined){
      return undefined;
    }
    const v = computeRackOccupancyRate(task, startState, this.section()?.actions ?? []);
    return v !== undefined ? v.toFixed(2) : undefined;
  });

  onBranch(){

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
      }
    });
  }
}
