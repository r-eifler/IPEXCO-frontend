import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { ControlsComponent } from '../../components/controls/controls.component';
import { SectionTreeHeroComponent } from '../../components/section-tree-hero/section-tree-hero.component';
import { SectionTreeComponent } from '../../components/section-tree/section-tree.component';
import { initFlightPlanTree } from '../../state/flight-section-planning.actions';
import { selectFlights, selectHasTree, selectInitialState, selectProject } from '../../state/flight-section-planning.selector';

@Component({
  selector: 'app-section-forest',
  imports: [
    PageModule,
    TranslocoModule,
    ControlsComponent,
    SectionTreeComponent,
    MatIconModule,
    MatButtonModule,
    SectionTreeHeroComponent,
  ],
  templateUrl: './plan-section-overview.component.html',
  styleUrl: './plan-section-overview.component.scss'
})
export class PlanSectionsOverview {

  store = inject(Store);
  
  project = this.store.selectSignal(selectProject);
  flights = this.store.selectSignal(selectFlights);
  hasTree = this.store.selectSignal(selectHasTree);

  initialState = this.store.selectSignal(selectInitialState);

  newTree(){
    let projectId = this.project()?._id;
    let initialState = this.initialState()
    if(projectId !== undefined && initialState !== undefined){
      this.store.dispatch(initFlightPlanTree({projectId, initialState}));
    }
  } 
}
