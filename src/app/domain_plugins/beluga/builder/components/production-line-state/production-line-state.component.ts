import { Component, computed, effect, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { InfoModule } from 'src/app/shared/components/info/info.module';
import { ProductionLineTargetSchedule } from '../../../flight-section-planning/domain/flight-section';
import { selectJigTypes } from '../../state/builder.selector';
import { JigStatusProductionLineComponent } from '../jig-status-production-line/jig-status-production-line.component';
import { TranslocoModule } from '@jsverse/transloco';
import { Jig, JigType } from '../../../shared/domain/beluga_problem';
import { skipProductionJig } from '../../state/builder.actions';
import { selectProductionLinesStatusSchedule } from './production-line-state.selector';

@Component({
  selector: 'app-production-line-state',
  imports: [
    TranslocoModule,
    JigStatusProductionLineComponent,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    InfoModule,
  ],
  templateUrl: './production-line-state.component.html',
  styleUrl: './production-line-state.component.scss'
})
export class ProductionLineStateComponent {

  store = inject(Store);

  
  jigs = input.required<Record<string,Jig>>();
  jigTypes = input.required<Record<string,JigType>>();
  
  productionLineName = input.required<string>();

  schedule = computed(() => this.store.selectSignal(selectProductionLinesStatusSchedule(this.productionLineName()))())
  nextJigStatus = computed(() => this.schedule()?.find(e => e.status.next))

  skipPossible = computed(() => this.nextJigStatus() !== undefined)
  lineEmpty = computed(() => this.schedule()?.length == 0)

  onSkip(){
    const nextJigStatus = this.nextJigStatus();
    if(nextJigStatus === undefined ||  nextJigStatus.jig === undefined){
      return
    }
    this.store.dispatch(skipProductionJig({jigName: nextJigStatus.jig?.name, productionLine: this.productionLineName()}))
  }

  constructor(){
    effect(() => console.log(this.schedule()))
  }
}
