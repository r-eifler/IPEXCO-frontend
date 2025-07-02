import { Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { TraceInspectorComponent } from '../../../shared/components/trace-inspector/trace-inspector.component';
import { selectSelectedSection } from '../../state/flight-section-planning.selector';
import { BelugaActionType } from '../../../shared/domain/beluga_plan';
import { getFullStartState } from '../../domain/flight-section';

@Component({
  selector: 'app-plan-inspector',
  imports: [
    TranslocoModule,
    TraceInspectorComponent,
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

  actions = computed(() => this.section()?.actions.filter(a => a.name !== BelugaActionType.SWITCH_TO_NEXT_BELUGA) ?? [])

  startState = computed(() => getFullStartState(this.section()))

  name = computed(() => {
    let config = this.configuration();
    if(config == undefined){
      return "Unknown"
    }
    return config.flightTargetSchedule.name;
  });

}
