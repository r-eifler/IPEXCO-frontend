import { Component, computed, input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Jig, JigType, Rack } from '../../domain/beluga_problem';
import { JigComponent } from '../jig/jig.component';
import { sum } from 'ramda';

@Component({
  selector: 'app-rack',
  imports: [
    MatTooltipModule,
    JigComponent,
  ],
  templateUrl: './rack.component.html',
  styleUrl: './rack.component.scss'
})
export class RackComponent {

  rack = input.required<{name: string, size: number, jigs: Jig[]}>();
  jigTypes = input.required<Record<string,JigType>>();

  name = computed(() => this.rack()?.name.replace('rack',''))
  occupied = computed(() => sum(this.rack().jigs.map(j => 
    j.empty ? this.jigTypes()?.[j.type].size_empty : this.jigTypes()?.[j.type].size_loaded))
  )

  tooltip = computed(() => 'size: ' + this.rack().size)
}
