import { Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TestCase, TestRunStatus } from '../../domain/tests';
import { ErrorPolicyTraceComponent } from '../error-policy-trace/error-policy-trace.component';
import { getInitialState, SiteAndScheduleStateInfo } from '../../../shared/domain/beluga_state';
import { ActionCardComponent } from '../../../shared/components/action-card/action-card.component';


@Component({
  selector: 'app-test-case-panel',
  imports: [
    MatExpansionModule,
    MatIconModule,
    RouterLink,
    MatButtonModule,
    ErrorPolicyTraceComponent,
    ActionCardComponent,
  ],
  templateUrl: './test-case-panel.component.html',
  styleUrl: './test-case-panel.component.scss'
})
export class TestCasePanelComponent {

  testCase = input.required<TestCase>();

  isBug = computed(() => this.testCase()?.classifiedAdBug)
  method = computed(() => this.testCase()?.method)

  icon = computed(() => {
    if(this.testCase()?.status !== TestRunStatus.FINISHED){
      return 'question_mark'
    }
    if(this.testCase()?.classifiedAdBug){
      return 'bug_report'
    }
    else {
      return 'check'
    }
  })

  actions = computed(() => this.testCase()?.policyTrace)
  problem = computed(() => this.testCase()?.problem)

}
