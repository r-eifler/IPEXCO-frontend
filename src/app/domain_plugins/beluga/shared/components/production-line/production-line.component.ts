import { Component, computed, input } from '@angular/core';
import { ProductionLine } from '../../domain/beluga_problem';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-production-line',
  imports: [
    TranslocoModule
  ],
  providers: [
    provideTranslocoScope({
      scope: "builder",
      alias: "b",
    }),
  ],
  templateUrl: './production-line.component.html',
  styleUrl: './production-line.component.scss'
})
export class ProductionLineComponent {

  line = input.required<ProductionLine>();

  lineName = computed(() => this.line()?.name.replace('pl',''))
  jigNames = computed(() => this.line()?.schedule.map(j => j.replace('jig', '')))
}
