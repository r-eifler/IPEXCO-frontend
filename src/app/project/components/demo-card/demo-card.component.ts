import { Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { DefaultPipe } from 'src/app/shared/common/pipe/default.pipe';
import { LabelModule } from 'src/app/shared/components/label/label.module';
import { PlanProperty } from '../../../shared/domain/plan-property/plan-property';
import { Demo } from 'src/app/demo/domain/demo';
import { StepStatusNamePipe } from 'src/app/iterative_planning/domain/pipe/step-status-name.pipe';
import { StepStatusColorPipe } from 'src/app/iterative_planning/domain/pipe/step-status-color.pipe';
import { StepValuePipe } from 'src/app/iterative_planning/domain/pipe/step-value.pipe';
import { DemoStatusColorPipe } from '../../pipe/demo-status-color.pipe';
import { DemoStatusNamePipe } from '../../pipe/demo-status-name.pipe';

@Component({
  selector: 'app-demo-card',
  standalone: true,
  imports: [
    MatCardModule, 
    MatChipsModule, 
    MatIconModule, 
    LabelModule, 
    MatButtonModule, 
    MatTooltipModule, 
    DemoStatusNamePipe,
    DemoStatusColorPipe
  ],
  templateUrl: './demo-card.component.html',
  styleUrl: './demo-card.component.scss'
})
export class DemoCardComponent {

  router = inject(Router);
  route = inject(ActivatedRoute);

  demo = input.required<Demo | null>();
  planProperties = input.required<Record<string, PlanProperty> | null>();

  run = output<void>();

  onRun(): void {
    this.run.emit();
  }

  onDetails(): void {
    this.router.navigate([this.demo()?._id, 'details'], {relativeTo: this.route})
  }
}
