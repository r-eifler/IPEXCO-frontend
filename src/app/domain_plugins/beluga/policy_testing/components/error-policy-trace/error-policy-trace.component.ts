import { Component, computed, input } from '@angular/core';
import { ActionCardComponent } from '../../../shared/components/action-card/action-card.component';
import { BelugaAction } from '../../../shared/domain/beluga_plan';
import { BelugaProblem } from '../../../shared/domain/beluga_problem';
import { getInitialState } from '../../../shared/domain/beluga_state';
import { getSiteSetUp } from '../../../shared/domain/site_set_up';
import { getActionLoop } from '../../../shared/domain/testing_utils';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-policy-trace',
  imports: [
    ActionCardComponent,
    MatIconModule,
  ],
  templateUrl: './error-policy-trace.component.html',
  styleUrl: './error-policy-trace.component.scss'
})
export class ErrorPolicyTraceComponent {

  actions = input.required<BelugaAction[]>();
  problem = input.required<BelugaProblem>();

  prefixAndLoop = computed(() => {
    const problem = this.problem();
    const actions = this.actions();

    if(problem === undefined || actions === undefined){
      return null;
    }

    const startState = getInitialState(problem);
    const siteSetUp = getSiteSetUp(problem);
    const flights = problem.flights;
    const productionLines = problem.production_lines;

    return getActionLoop(actions, startState, siteSetUp, flights, productionLines);
  })

}
