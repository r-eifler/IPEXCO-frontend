import { Component, computed, input } from '@angular/core';
import { TestCollection, TestRunStatus } from '../../domain/test-case';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-test-results-plots',
  imports: [
    NgxChartsModule
  ],
  templateUrl: './test-results-plots.component.html',
  styleUrl: './test-results-plots.component.scss'
})
export class TestResultsPlotsComponent {

    colorScheme = {
      domain: ['#f03a49', '#3a8cf0', '#9a9b9c']
    };

    testSuite = input.required<TestCollection>();

    data = computed(() => {
      const num_bugs = this.testSuite()?.testCases.filter(tc => tc.classifiedAdBug)?.length ?? 0;
      const num_pending = this.testSuite()?.testCases.filter(tc => tc.status !== TestRunStatus.FINISHED)?.length ?? 0;
      const num_finished_and_not_bug = this.testSuite()?.testCases.filter(tc => tc.status == TestRunStatus.FINISHED && !tc.classifiedAdBug)?.length ?? 0;

      return [
        {
          "name": "bugs",
          "value": num_bugs
        },
        {
          "name": "finished",
          "value": num_finished_and_not_bug
        },
        {
          "name": "pending",
          "value": num_pending
        },
      ]
    })

}
