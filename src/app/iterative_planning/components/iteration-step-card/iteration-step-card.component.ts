import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { IterationStep } from '../../domain/iteration_step';
import { StepStatusNamePipe } from '../../domain/pipe/step-status-name.pipe';

@Component({
  selector: 'app-iteration-step-card',
  standalone: true,
  imports: [MatCardModule, MatChipsModule, StepStatusNamePipe, MatIconModule],
  templateUrl: './iteration-step-card.component.html',
  styleUrl: './iteration-step-card.component.scss'
})
export class IterationStepCardComponent {
  step = input.required<IterationStep | null>();
}
