import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

import { DefaultPipe } from 'src/app/shared/common/pipe/default.pipe';
import { LabelModule } from 'src/app/shared/components/label/label.module';
import { IterationStep } from '../../domain/iteration_step';
import { StepStatusColorPipe } from '../../domain/pipe/step-status-color.pipe';
import { StepStatusNamePipe } from '../../domain/pipe/step-status-name.pipe';
import { StepValuePipe } from '../../domain/pipe/step-value.pipe';
import { PlanProperty } from '../../../shared/domain/plan-property/plan-property';

@Component({
    selector: 'app-iteration-step-card',
    imports: [MatCardModule, MatChipsModule, StepStatusNamePipe, MatIconModule, LabelModule, StepValuePipe, DefaultPipe, MatButtonModule, RouterLink, MatTooltipModule, StepStatusColorPipe],
    templateUrl: './iteration-step-card.component.html',
    styleUrl: './iteration-step-card.component.scss'
})
export class IterationStepCardComponent {
  step = input.required<IterationStep | null>();
  planProperties = input.required<Record<string, PlanProperty> | null>();

  fork = output<void>();

  onFork(): void {
    this.fork.emit();
  }
}
