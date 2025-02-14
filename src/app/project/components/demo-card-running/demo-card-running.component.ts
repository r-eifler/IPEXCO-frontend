import { Component, inject, input } from '@angular/core';
import { PlanProperty } from 'src/app/shared/domain/plan-property/plan-property';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LabelModule } from 'src/app/shared/components/label/label.module';
import { DemoStatusColorPipe } from '../../pipe/demo-status-color.pipe';
import { DemoStatusNamePipe } from '../../pipe/demo-status-name.pipe';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Store } from '@ngrx/store';
import { cancelDemoCreation } from '../../state/project.actions';
import { Demo } from 'src/app/shared/domain/demo';

@Component({
  selector: 'app-demo-card-running',
  imports: [
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    LabelModule,
    MatButtonModule,
    MatTooltipModule,
    DemoStatusNamePipe,
    DemoStatusColorPipe,
    MatProgressBarModule,
  ],
  templateUrl: './demo-card-running.component.html',
  styleUrl: './demo-card-running.component.scss'
})
export class DemoCardRunningComponent {

  store = inject(Store);

  demo = input.required<Demo | null>();
  planProperties = input.required<Record<string, PlanProperty> | null>();

  onCancel() {
    const demo = this.demo();
    if(demo !== null)
      this.store.dispatch(cancelDemoCreation({demoId: demo._id}))
  }

}
