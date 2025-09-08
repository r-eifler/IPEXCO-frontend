import { Component, computed, effect, inject, input } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PlanRunStatus } from 'src/app/iterative_planning/domain/plan';
import { metricsFunctionMap, MetricType } from '../../domain/metrics';
import { BelugaProblem } from '../../../shared/domain/beluga_problem';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { FlightsHorizon } from '../../domain/flight-section';

@Component({
  selector: 'app-section-metric-graph',
  imports: [
    NgxChartsModule,
    TranslocoModule,
  ],
  templateUrl: './section-metric-graph.component.html',
  styleUrl: './section-metric-graph.component.scss'
})
export class SectionMetricGraphComponent {

  transloco = inject(TranslocoService);

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Flight Sections';
  timeline: boolean = true;

  task = input.required<BelugaProblem>();

  branchSections = input.required<{
    name: string, 
    sections: FlightsHorizon[]
  }[]>();

  metric = input.required<MetricType>();

  data = computed(() => 
    this.branchSections()?.map(bs => ({
      name: bs.name,
      series: bs.sections?.filter(s => s.status === PlanRunStatus.SOLVED).
        map((s, index) => ({
            value: metricsFunctionMap[this.metric()](s),
            name: index
        })) ?? []
    }))
  )

}
