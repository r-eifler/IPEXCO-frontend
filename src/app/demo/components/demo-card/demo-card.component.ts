import { Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';


import { LabelModule } from 'src/app/shared/components/label/label.module';
import { PlanProperty } from '../../../shared/domain/plan-property/plan-property';
import { Demo } from 'src/app/project/domain/demo';
import { DemoStatusNamePipe } from 'src/app/project/pipe/demo-status-name.pipe';
import { DemoStatusColorPipe } from 'src/app/project/pipe/demo-status-color.pipe';


@Component({
    selector: 'app-demo-card',
    imports: [
        MatCardModule,
        MatChipsModule,
        MatIconModule,
        LabelModule,
        MatButtonModule,
        MatTooltipModule,
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
    this.router.navigate(['..', this.demo()?._id, 'details'], {relativeTo: this.route})
  }
}
