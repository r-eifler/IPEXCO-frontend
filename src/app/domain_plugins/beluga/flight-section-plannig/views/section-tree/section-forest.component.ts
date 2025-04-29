import { Component, computed, inject } from '@angular/core';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { selectFlightInRange, selectFlightSectionForest } from '../../state/flight-section-planning.selector';
import { FlightInfoCardComponent } from '../../components/flight-info-card/flight-info-card.component';
import { ControlsComponent } from '../../components/controls/controls.component';

@Component({
  selector: 'app-section-tree',
  imports: [
    PageModule,
    TranslocoModule,
    FlightInfoCardComponent,
    ControlsComponent,
  ],
  providers: [
      provideTranslocoScope({
        scope: "flight_section_planning",
        alias: "f",
      }),
    ],
  templateUrl: './section-forest.component.html',
  styleUrl: './section-forest.component.scss'
})
export class SectionForestComponent {

  store = inject(Store);
  
  forest = this.store.selectSignal(selectFlightSectionForest);
  flights = this.store.selectSignal(selectFlightInRange);
  
  // rootSections = computed(() => this.forest()?.roots.map(rId => this.forest()?.sections[rId]))

}
