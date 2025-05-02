import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { InfoComponent } from 'src/app/shared/components/info/info/info.component';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { ControlsComponent } from '../../components/controls/controls.component';
import { FlightInfoCardComponent } from '../../components/flight-info-card/flight-info-card.component';
import { SectionTreeComponent } from '../../components/section-tree/section-tree.component';
import { initFlightPlanTree } from '../../state/flight-section-planning.actions';
import { selectActiveBranchLastSectionFinished, selectFlights, selectHasTree, selectProject } from '../../state/flight-section-planning.selector';
import { SectionTreeHeroComponent } from '../../components/section-tree-hero/section-tree-hero.component';

@Component({
  selector: 'app-section-forest',
  imports: [
    PageModule,
    TranslocoModule,
    FlightInfoCardComponent,
    ControlsComponent,
    SectionTreeComponent,
    MatIconModule,
    MatButtonModule,
    InfoComponent,
    SectionTreeHeroComponent,
  ],
  providers: [
      provideTranslocoScope({
        scope: "flight_section_planning",
        alias: "f",
      }),
    ],
  templateUrl: './plan-section-overview.component.html',
  styleUrl: './plan-section-overview.component.scss'
})
export class PlanSectionsOverview {

  store = inject(Store);
  
  project = this.store.selectSignal(selectProject);
  flights = this.store.selectSignal(selectFlights);
  hasTree = this.store.selectSignal(selectHasTree);


  newTree(){
    let projectId = this.project()?._id;
    if(projectId !== undefined){
      this.store.dispatch(initFlightPlanTree({projectId}));
    }
  } 
}
