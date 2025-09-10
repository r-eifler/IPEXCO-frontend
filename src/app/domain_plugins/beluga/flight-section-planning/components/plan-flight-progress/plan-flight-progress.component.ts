import { Component, computed, effect, input } from '@angular/core';
import { FlightsHorizon } from '../../domain/flight-section';
import { BelugaActionType } from '../../../shared/domain/beluga_plan';
import { MatIconModule } from '@angular/material/icon';
import { getFlightPlanProgressStatus, ProgressStatus } from '../../domain/utils';


@Component({
  selector: 'app-plan-flight-progress',
  imports: [
    MatIconModule,
  ],
  templateUrl: './plan-flight-progress.component.html',
  styleUrl: './plan-flight-progress.component.scss'
})
export class PlanFlightProgressComponent {

  section = input.required<FlightsHorizon>();

  Statuses = ProgressStatus;

  flights = computed(() => {
    const flights = this.section()?.configurations[this.section()?.configurationIndex].flightTargetSchedule
    return this.section()?.flightIndices.map(index => flights[index])
  })

  planSectionsStatuses = computed(() => getFlightPlanProgressStatus(this.section()?.actions, this.flights()))

}
