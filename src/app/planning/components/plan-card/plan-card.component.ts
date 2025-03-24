import { Component, computed, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Service } from 'src/app/global_specification/domain/services';
import { StepStatusColorPipe } from 'src/app/iterative_planning/domain/pipe/step-status-color.pipe';
import { StepStatusNamePipe } from 'src/app/iterative_planning/domain/pipe/step-status-name.pipe';
import { PlanRunStatus } from 'src/app/iterative_planning/domain/plan';
import { LabelModule } from 'src/app/shared/components/label/label.module';
import { Plan } from '../../domain/plan';

@Component({
  selector: 'app-plan-card',
  imports: [
    MatCardModule, 
    MatChipsModule, 
    StepStatusNamePipe, 
    MatIconModule, 
    LabelModule, 
    MatButtonModule, 
    RouterLink, 
    MatTooltipModule, 
    StepStatusColorPipe,
    MatProgressBarModule,
  ],
  templateUrl: './plan-card.component.html',
  styleUrl: './plan-card.component.scss'
})
export class PlanCardComponent {

  store = inject(Store);
  
  plan = input.required<Plan | null>();
  planner = input.required<Service | null>();

  planComputationRunning = computed(() => 
    this.plan()?.status == PlanRunStatus.PENDING || 
    this.plan()?.status == PlanRunStatus.RUNNING
  )

  cancel = output<void>();

  onCancel(): void {
    this.cancel.emit();
  }

}
