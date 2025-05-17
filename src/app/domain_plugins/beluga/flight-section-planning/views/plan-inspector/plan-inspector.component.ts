import { Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { SectionPlanComponent } from '../../../shared/view/section-plan/section-plan.component';
import { selectSelectedSection } from '../../state/flight-section-planning.selector';

@Component({
  selector: 'app-plan-inspector',
  imports: [
    TranslocoModule,
    SectionPlanComponent,
    PageModule,
    BreadcrumbModule,
    MatIconModule,
  ],
  templateUrl: './plan-inspector.component.html',
  styleUrl: './plan-inspector.component.scss'
})
export class PlanInspectorComponent {

  store = inject(Store);

  section = this.store.selectSignal(selectSelectedSection);
  configuration = computed(() => {
    const index = this.section()?.configurationIndex;
    if(index === undefined){
      return undefined;
    }
    return this.section()?.configurations[index];
  })

  name = computed(() => {
    let config = this.configuration();
    if(config == undefined){
      return "Unknown"
    }
    return config.flightTargetSchedule.name;
  });

}
