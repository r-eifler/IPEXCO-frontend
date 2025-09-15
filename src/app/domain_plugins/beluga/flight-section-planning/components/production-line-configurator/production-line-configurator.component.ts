import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Jig, JigType, ProductionLine } from '../../../shared/domain/beluga_problem';
import { ProductionLineTargetSchedule } from '../../domain/flight-section';
import { JigConfiguratorComponent } from '../jig-configurator/jig-configurator.component';
import { MatCardModule } from '@angular/material/card';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-production-line-configurator',
  imports: [
    MatButtonModule,
    MatIconModule,
    JigConfiguratorComponent,
    MatCardModule,
    TranslocoModule,
  ],
  templateUrl: './production-line-configurator.component.html',
  styleUrl: './production-line-configurator.component.scss'
})
export class ProductionLineConfiguratorComponent {

  productionLineTargetSchedule = input.required<ProductionLineTargetSchedule>();
  name = computed(() => this.productionLineTargetSchedule().name)

  jigsOnSite = input.required<Set<string>>();
  jigs = input.required<Record<string,Jig>>();
  jigTypes = input.required<Record<string,JigType>>();
  disabled = input<boolean>(false);

  conflictMembers = input<{
    jigName: string,
    productionLineName: string,
    position: number
  }[]>([]);

  change = output<{index: number, skip: boolean}>();

  inConflict = computed(() => this.conflictMembers()?.find(c =>  c.productionLineName == this.productionLineTargetSchedule().name))

  schedule = computed(() => {
    const schedule = this.productionLineTargetSchedule().schedule;
    if(schedule !== undefined && this.jigs() !== undefined){
      return schedule?.map(e => ({
        jig: this.jigs()?.[e.jig],
        status: {
          skip: e.skip,
          onSite: e.onSite,
          inConflict: this.conflictMembers()?.find(c => c.jigName == e.jig && c.productionLineName == this.productionLineTargetSchedule().name) 
        }
      }))
    }
    return []
  })

  
  setStatus(index: number, skip: boolean){
    this.change.emit({index, skip})
  }
}
