import { Component, computed, effect, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { DialogModule } from 'src/app/shared/components/dialog/dialog.module';
import { selectSelectedSection, selectTask } from '../../state/flight-section-planning.selector';
import { SinglePlanViewComponent } from '../../../shared/view/single-plan-view/single-plan-view.component';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SectionPlanComponent } from '../../../shared/view/section-plan/section-plan.component';

@Component({
  selector: 'app-plan-inspector',
  imports: [
    TranslocoModule,
    SectionPlanComponent,
    PageModule,
    BreadcrumbModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './plan-inspector.component.html',
  styleUrl: './plan-inspector.component.scss'
})
export class PlanInspectorComponent {

  store = inject(Store);

  section = this.store.selectSignal(selectSelectedSection);

  name = computed(() => {
    let section = this.section();
    if(section == undefined){
      return "Unknown"
    }
    return section.flightTargetSchedule.name;
  });

}
