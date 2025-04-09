import { Component, computed, input } from '@angular/core';
import { ProductionLine } from '../../domain/beluga_problem';

@Component({
  selector: 'app-production-line',
  imports: [],
  templateUrl: './production-line.component.html',
  styleUrl: './production-line.component.scss'
})
export class ProductionLineComponent {

  line = input.required<ProductionLine>();

  lineName = computed(() => this.line()?.name.replace('pl',''))
  jigNames = computed(() => this.line()?.schedule.map(j => j.replace('jig', '')))
}
