import { Component, computed, input } from '@angular/core';
import { TestCase, TestRunStatus } from '../../domain/tests';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ActionCardComponent } from '../../../shared/components/action-card/action-card.component';


@Component({
  selector: 'app-test-case-panel',
  imports: [
    MatExpansionModule,
    MatIconModule,
    ActionCardComponent,
  ],
  templateUrl: './test-case-panel.component.html',
  styleUrl: './test-case-panel.component.scss'
})
export class TestCasePanelComponent {

  testCase = input.required<TestCase>();

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

}
