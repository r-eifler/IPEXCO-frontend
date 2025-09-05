import { Component, computed, input } from '@angular/core';
import { Jig, JigType, ProductionLine } from '../../domain/beluga_problem';
import { MatCardModule } from '@angular/material/card';
import { JigComponent } from '../jig/jig.component';

@Component({
  selector: 'app-multi-production-line-card',
  imports: [
    MatCardModule,
    JigComponent,
  ],
  templateUrl: './multi-production-line-card.component.html',
  styleUrl: './multi-production-line-card.component.scss'
})
export class MultiProductionLineCardComponent {

    productionLines = input.required<ProductionLine[]>();
    jigs = input.required<Record<string,Jig>>();
    jigTypes = input.required<Record<string,JigType>>();

    displayLines = computed(() => this.productionLines()?.map(line => ({
      name: line.name,
      schedule: line.schedule.map(jigName => {
        let jig = this.jigs()?.[jigName];
        let jigType = this.jigTypes()?.[jig.type]
        return {jig, jigType}
      })
    })))

}
