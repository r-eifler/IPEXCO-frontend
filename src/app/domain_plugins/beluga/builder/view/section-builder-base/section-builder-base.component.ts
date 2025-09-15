import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { FlightStateComponent } from '../../components/flight-state/flight-state.component';
import { HangarsStateComponent } from '../../components/hangars-state/hangars-state.component';
import { ProductionLinesStateComponent } from '../../components/production-lines-state/production-lines-state.component';
import { RacksStateComponent } from '../../components/racks-state/racks-state.component';
import { SectionActionListComponent } from '../../components/section-action-list/section-action-list.component';
import { SectionControlsComponent } from '../../components/section-controls/section-controls.component';
import { TrailersStateComponent } from '../../components/trailers-state/trailers-state.component';
import { MultiFlightCardComponent } from '../../../shared/components/multi-flight-card/multi-flight-card.component';
import { selectCurrentRelativeFlightIndex, selectFlightScheduleOrdered, selectJigsState, selectJigTypes, selectProgressStatusFlights } from '../../state/builder.selector';

@Component({
  selector: 'app-section-builder-base',
  imports: [
      PageModule,
      TranslocoModule,
      BreadcrumbModule,
      MatIconModule,
      HangarsStateComponent,
      FlightStateComponent,
      ProductionLinesStateComponent,
      RacksStateComponent,
      TrailersStateComponent,
      SectionActionListComponent,
      CdkDropListGroup,
      SectionControlsComponent,
      MultiFlightCardComponent
    ],
  providers: [
      provideTranslocoScope({
        scope: "builder",
        alias: "b",
      }),
  ],
  templateUrl: './section-builder-base.component.html',
  styleUrl: './section-builder-base.component.scss'
})
export class SectionBuilderBaseComponent {

    store = inject(Store);

    orderedFlightSchedules = this.store.selectSignal(selectFlightScheduleOrdered);
    jigTypes = this.store.selectSignal(selectJigTypes);
    jigs= this.store.selectSignal(selectJigsState);

    currentRelativeFlightIndex = this.store.selectSignal(selectCurrentRelativeFlightIndex);
    progressStatusFlights = this.store.selectSignal(selectProgressStatusFlights);

    orderedFlights = computed(() => this.orderedFlightSchedules()?.map(flight => ({
        ...flight,
        incoming: flight?.incoming.map( e => e.jig),
        outgoing: flight?.outgoing.map(e => e.jigType) 
      })
    ))
}
