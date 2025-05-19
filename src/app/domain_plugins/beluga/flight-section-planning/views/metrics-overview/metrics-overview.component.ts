import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { MetricsControlsComponent } from '../../components/metrics-controls/metrics-controls.component';
import { selectBranches, selectBranchSections, selectTask } from '../../state/flight-section-planning.selector';
import { SectionMetricGraphComponent } from '../../components/section-metric-graph/section-metric-graph.component';
import { MetricType } from '../../domain/metrics';

@Component({
  selector: 'app-metrics-overview',
  imports: [
      TranslocoModule,
      PageModule,
      BreadcrumbModule,
      MatIconModule,
      MetricsControlsComponent,
      SectionMetricGraphComponent,
  ],
  templateUrl: './metrics-overview.component.html',
  styleUrl: './metrics-overview.component.scss'
})
export class MetricsOverviewComponent {

  store = inject(Store);
  task = this.store.selectSignal(selectTask);
  branches = this.store.selectSignal(selectBranches);

  selectedBranches: WritableSignal<number[]> = signal([])
  selectedMetric: WritableSignal<MetricType> = signal(MetricType.PLAN_LENGTH)


  branchSections = computed(() => this.selectedBranches().map(index => ({
      name: this.branches()?.[index].name,
      sections: this.store.selectSignal(selectBranchSections(index))()
    })
  ));


  onChangeSelection(indices: number[]){
    this.selectedBranches.set(indices);
  }

  onChangeMetric(metric: MetricType){
    this.selectedMetric.set(metric);
  }

}
