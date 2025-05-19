import { Component, effect, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectDifferentBranch } from '../../state/flight-section-planning.actions';
import { selectBranchIndex, selectBranches } from '../../state/flight-section-planning.selector';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MetricType } from '../../domain/metrics';

@Component({
  selector: 'app-metrics-controls',
  imports: [
    TranslocoModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatFormFieldModule, 
    MatSelectModule, 
    FormsModule, 
    ReactiveFormsModule,
    MatTooltipModule,
    RouterModule,
  ],
  templateUrl: './metrics-controls.component.html',
  styleUrl: './metrics-controls.component.scss'
})
export class MetricsControlsComponent {

  disabled = input<boolean>(false);

  selectedBranches = output<number[]>();
  selectedMetric = output<MetricType>();
  
  store = inject(Store);
  fb = inject(FormBuilder);

  form  = this.fb.group({
    branches: this.fb.control<number[]>([], {nonNullable: true}),
    metric: this.fb.control<MetricType>(MetricType.PLAN_LENGTH, {nonNullable: true}),
  })
  
  selectedBranch = this.store.selectSignal(selectBranchIndex);
  branches = this.store.selectSignal(selectBranches);

  metrics  = [
    MetricType.PLAN_LENGTH,
    MetricType.NUM_SWAPS,
    MetricType.RACK_OCCUPANCY
  ]

  constructor(){
    effect(() => {
      console.log(this.selectedBranch());
      let branchIndex = this.selectedBranch()
      if (branchIndex !== undefined){
        this.form.controls.branches.setValue([branchIndex])
      }
    })

    this.form.controls.branches.valueChanges.pipe(takeUntilDestroyed()).subscribe(
      newIndices => {
        if(newIndices !== null){
          console.log(newIndices);
          this.selectedBranches.emit(newIndices);
        }
      }
    );

    this.form.controls.metric.valueChanges.pipe(takeUntilDestroyed()).subscribe(
      metric => {
        if(metric !== null){
          console.log(metric);
          this.selectedMetric.emit(metric);
        }
      }
    );
  }

}
