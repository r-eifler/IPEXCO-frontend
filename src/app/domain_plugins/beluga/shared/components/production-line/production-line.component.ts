import { Component, computed, effect, input } from '@angular/core';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { ProductionLine } from '../../domain/beluga_problem';
import { ProductionLineTargetSchedule } from '../../../flight-section-planning/domain/flight-section';

@Component({
  selector: 'app-production-line',
  imports: [
    TranslocoModule
  ],
   providers: [
      provideTranslocoScope({
        scope: "shared",
        alias: "s",
      }),
    ],
  templateUrl: './production-line.component.html',
  styleUrl: './production-line.component.scss'
})
export class ProductionLineComponent {

  line = input.required<ProductionLineTargetSchedule>();
  delivered = input.required<string[]>();

  remainingJigs = computed(() => this.line().schedule.filter(js => !this.delivered()?.includes(js.jig)))

  lineName = computed(() => this.line()?.name.replace('pl',''))
  jigNames = computed(() => this.remainingJigs().map(js => js.jig.replace('jig', '')))

  constructor(){
    effect(() => console.log(this.delivered()))
  }
}
