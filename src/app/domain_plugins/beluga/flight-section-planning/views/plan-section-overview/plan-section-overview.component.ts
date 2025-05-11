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
import { selectFlights, selectHasTree, selectInitialState, selectProject, selectTask } from '../../state/flight-section-planning.selector';
import { getSiteSetUp } from '../../../shared/domain/site_set_up';
import { selectTaskState } from '../../../builder/state/builder.selector';

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
  task = this.store.selectSignal(selectTask);
  hasTree = this.store.selectSignal(selectHasTree);

  initialState = this.store.selectSignal(selectInitialState);

  newTree(){
    let projectId = this.project()?._id;
    const task = this.task();
    let initialState = this.initialState()
    if(projectId !== undefined && initialState !== undefined && task !== undefined){
      let siteSetUp = getSiteSetUp(task);
      this.store.dispatch(initFlightPlanTree({projectId, siteState: initialState, siteSetUp}));
    }
  } 
}
