import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { FlightStateComponent } from '../../components/flight-state/flight-state.component';
import { HangarsStateComponent } from '../../components/hangars-state/hangars-state.component';
import { PlanSectionComponent } from '../../components/plan-section/plan-section.component';
import { ProductionLineStateComponent } from '../../components/production-line-state/production-line-state.component';
import { RacksStateComponent } from '../../components/racks-state/racks-state.component';
import { SectionControlsComponent } from '../../components/section-controls/section-controls.component';
import { TrailersStateComponent } from '../../components/trailers-state/trailers-state.component';

@Component({
  selector: 'app-section-builder-base',
  imports: [
      PageModule,
      TranslocoModule,
      BreadcrumbModule,
      MatIconModule,
      HangarsStateComponent,
      FlightStateComponent,
      ProductionLineStateComponent,
      RacksStateComponent,
      TrailersStateComponent,
      PlanSectionComponent,
      CdkDropListGroup,
      SectionControlsComponent,
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

    constructor(){
      console.log("SectionBuilderBaseComponent")
    }

}
